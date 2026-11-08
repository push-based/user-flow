export interface TargetGeneratorSchema {
  projectName: string;
  url: string;
  targetName?: string;
  skipPackageJson?: boolean;
  verbose?: boolean;
}
