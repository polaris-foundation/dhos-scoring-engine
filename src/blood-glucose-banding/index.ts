import * as RulesEngine from 'json-rules-engine';
import validationException from '../shared/exceptions';
import { compileThresholdsToRules } from './compile_thresholds';
import valueIsDefined from "../shared/valueIsDefined";
import {BandingIdResult, BandingScoreFields, BandingScoreRequest} from "./interfaces";
/* eslint-disable @typescript-eslint/no-use-before-define */

const bloodGlucoseReadingBanding = async (inputs: BandingScoreRequest): Promise<BandingIdResult> => {
  const validatedReading: BandingScoreFields = await validatedInputs(inputs);

  // Run the engine to evaluate

  const rulesEngineRules = compileThresholdsToRules(
    validatedReading.bloodGlucoseThresholds
  );
  const BloodGlucoseBandingEngine = new RulesEngine.Engine(rulesEngineRules);
  const {events} = await BloodGlucoseBandingEngine.run(validatedReading);
  return parseEventsToResponse(events);
};

const validatedInputs = async (inputs: BandingScoreRequest): Promise<BandingScoreFields> => {
  if (!valueIsDefined(inputs['blood_glucose_thresholds_mmoll'])) {
    throw new validationException(
      'Must have blood glucose threshold configuration',
      'Must include blood glucose threshold configuration in the body'
    );
  }
  if (
    !valueIsDefined(inputs['blood_glucose_value'])
      || !valueIsDefined(inputs['prandial_tag_id'])
  ) {
    throw new validationException(
      'Must have a blood glucose value and prandial tag',
      'Must include a valid blood glucose value and prandial tag in the body'
    );
  }

  return {
    bloodGlucoseValue: inputs['blood_glucose_value'],
    prandialTagId: inputs['prandial_tag_id'],
    bloodGlucoseThresholds: {
      OTHER: { low: 0, high: 999 },
      ...inputs['blood_glucose_thresholds_mmoll']
    }
  };
};


const parseEventsToResponse = async (events: RulesEngine.Event[]): Promise<BandingIdResult> => {
  const response: BandingIdResult = {
    banding_id: undefined
  };
  events.forEach(event => {
    if (event.type === 'bloodGlucoseReadingBanding') {
      response.banding_id = event.params?.level;
    } else {
      throw new Error('Unexpected rule event type ' + event.type);
    }
  });
  return response;
};

export default bloodGlucoseReadingBanding;
export { bloodGlucoseReadingBanding };
