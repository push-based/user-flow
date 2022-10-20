import {parse as puppeteerReplayParse, Step, UserFlow} from "@puppeteer/replay";

export function isMeasureType(str: string) {
    switch (str) {
        case 'navigation':
        case 'snapshot':
        case 'startTimespan':
        case 'stopTimespan':
            return true;
        default:
            return false;
    }
}

export function parse(recordingJson: { title: string, steps: {}[] }): UserFlow {
    const ufArr: Step[] = [];
    // filter out user-flow specific actions
    const steps = recordingJson.steps.filter(
        (value: any, index) => {
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
        value && (parsed.steps[index] = value);
    });
    return parsed;
}
