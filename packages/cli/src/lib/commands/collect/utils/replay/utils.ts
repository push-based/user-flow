import {parse as puppeteerReplayParse, Step, UserFlow} from "@puppeteer/replay";
import {MeasureModes} from "./types";

export function isMeasureType(str: string) {
    switch (str as MeasureModes) {
        case 'navigate':
        case 'snapshot':
        case 'startTimespan':
        case 'endTimespan':
            return true;
        default:
            return false;
    }
}
export function parse(recordingJson: { title: string, steps: {}[] }): UserFlow {
    const ufArr: Step[] = [];
    // filter out user-flow specific actions
    const steps = recordingJson.steps.filter(
        (value: any, index: number) => {
            if (isMeasureType(value?.type)) {
                ufArr[index] = value;
                return false;
            }
            return true;
        }
    );
    // parse the clean steps
    const parsed = puppeteerReplayParse({...recordingJson, steps});
    // add in user-flow specific actions
    ufArr.forEach((value, index) => {
        value && (parsed.steps.splice(index, 0, value));
    });
    return parsed;
}
