export interface TargetGeneratorSchema {
  projectName: string;
  targetName?: string;
  url: string;
  skipPackageJson?: boolean;
  verbose?: boolean;
}
