import {TargetGeneratorSchema} from "./schema";

export interface NormalizedSchema extends TargetGeneratorSchema {
  projectName: string;
  projectRoot: string;
}
