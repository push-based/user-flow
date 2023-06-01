import {InstallGeneratorSchema} from "./schema";

export interface NormalizedSchema extends InstallGeneratorSchema {
  projectName: string;
  projectRoot: string;
}
