import {InitGeneratorSchema} from "./schema";

export interface NormalizedSchema extends InitGeneratorSchema {
  projectName: string;
  projectRoot: string;
}
