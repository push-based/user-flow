const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');

// These options were migrated by @nx/webpack:convert-to-inferred from
// the project.json file and merged with the options in this file
const configValues = {
  build: {
    default: {
      target: 'web',
      outputPath: '../../dist/packages/nx-plugin-integration',
      compiler: 'babel',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/favicon.ico', './src/assets'],
      index: './src/index.html',
      baseHref: '/',
      styles: ['./src/styles.css'],
    },
    production: {
      optimization: true,
      outputHashing: 'all',
      sourceMap: false,
      namedChunks: false,
      extractLicenses: true,
      vendorChunk: false,
      fileReplacements: [
        {
          replace: './src/environments/environment.ts',
          with: './src/environments/environment.prod.ts',
        },
      ],
    },
  },
  serve: {
    default: {
      port: 4010,
      headers: { 'Access-Control-Allow-Origin': '*' },
      historyApiFallback: {
        index: '/index.html',
        disableDotRule: true,
        htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
      },
    },
    production: {},
  },
};

// Determine the correct configValue to use based on the configuration
const configuration = process.env.NX_TASK_TARGET_CONFIGURATION || 'default';

const buildOptions = {
  ...configValues.build.default,
  ...configValues.build[configuration],
};
const devServerOptions = {
  ...configValues.serve.default,
  ...configValues.serve[configuration],
};

/**
 * @type{import('webpack').WebpackOptionsNormalized}
 */
module.exports = async () => ({
  devServer: devServerOptions,
  plugins: [new NxAppWebpackPlugin(buildOptions)],
});
