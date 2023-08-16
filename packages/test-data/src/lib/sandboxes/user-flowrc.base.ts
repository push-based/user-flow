export const DEFAULT_RC_NAME = '.user-flowrc.json';
export const CLI_DEFAULT_RC_JSON = {
  'collect': {
    'url': "https://coffee-cart.netlify.app/",
    'ufPath': "./user-flows"
  },
  'persist': {
    'outPath': "./measures",
    'format': ['stdout']
  },
  'assert': {}
};

export const SANDBOX_BASE_RC_JSON = {
  'collect': {
    'url': "https://coffee-cart.netlify.app/",
    'ufPath': './src/lib/user-flows', // DEFAULT_COLLECT_UF_PATH
  },
  'persist': {
    'outPath': './src/lib/measures', //DEFAULT_PERSIST_OUT_PATH,
    'format': ['stdout']
  },
  'assert': {}
};
