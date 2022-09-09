import dayjs from 'dayjs';
import { News2Engine } from './engine';
import normaliseAcvpu from '../shared/normaliseAcvpu';
import createRankingKey from '../shared/createRankingKey';
import valueOrUndefinedStr from '../shared/valueOrUndefinedStr';
import validateInputs from '../shared/validateInputs';
import type { Event } from 'json-rules-engine';
import type {News2Inputs, News2Fields, News2Response, Unvalidated} from '../interfaces';

/* eslint-disable @typescript-eslint/no-use-before-define */

type News2ObsSet = Pick<News2Fields, Exclude<keyof News2Fields, 'dateRecorded'>> & {
  dateRecorded: dayjs.Dayjs;
}
const news2 = async (inputs: Partial<News2Inputs>): Promise<News2Response> => {
  const unvalidatedObs: Unvalidated<News2Fields> = await defaultInputs(inputs);
  const intermediate: News2Fields = await validateInputs(unvalidatedObs);

  // Normalise special inputs
  const validatedObs: News2ObsSet = {
    ...intermediate,
    dateRecorded: dayjs(intermediate.dateRecorded),
    consciousnessAcvpu: await normaliseAcvpu(
      intermediate.consciousnessAcvpu
    )
  };

  // Run the engine to evaluate
  const {events} = await News2Engine.run(validatedObs);
  return parseEventsToResponse(events, validatedObs);
};

const defaultInputs = async (inputs: Partial<News2Inputs>): Promise<Unvalidated<News2Fields>> => {
  if (typeof inputs.config === 'undefined') {
    inputs.config = {};
  }

  return {
    dateRecorded: valueOrUndefinedStr(inputs['time']),
    respiratoryRate: valueOrUndefinedStr(inputs['respiratory_rate']),
    heartRate: valueOrUndefinedStr(inputs['heart_rate']),
    oxygenSaturation: valueOrUndefinedStr(inputs['oxygen_saturation']),
    spo2Scale: valueOrUndefinedStr(inputs['spo2_scale']),
    o2Therapy: valueOrUndefinedStr(inputs['o2_therapy']),
    o2TherapyMask: valueOrUndefinedStr(inputs['o2_therapy_mask']),
    systolicBloodPressure: valueOrUndefinedStr(
      inputs['systolic_blood_pressure']
    ),
    consciousnessAcvpu: valueOrUndefinedStr(inputs['consciousness_acvpu']),
    temperature: valueOrUndefinedStr(inputs['temperature']),
    nurseConcern: valueOrUndefinedStr(inputs['nurse_concern']),
    zeroSeverityIntervalHours: valueOrUndefinedStr(
      inputs['config']['zero_severity_interval_hours']
    ),
    lowSeverityIntervalHours: valueOrUndefinedStr(
      inputs['config']['low_severity_interval_hours']
    ),
    lowMediumSeverityIntervalHours: valueOrUndefinedStr(
      inputs['config']['low_medium_severity_interval_hours']
    ),
    mediumSeverityIntervalHours: valueOrUndefinedStr(
      inputs['config']['medium_severity_interval_hours']
    ),
    highSeverityIntervalHours: valueOrUndefinedStr(
      inputs['config']['high_severity_interval_hours']
    )
  };
};

const parseEventsToResponse = async (events: Event[], obsSet: News2ObsSet): Promise<News2Response> => {
  const response: News2Response = {
    respiratory_rate_score: 0,
    oxygen_saturation_score: 0,
    o2_therapy_score: 0,
    blood_pressure_score: 0,
    heart_rate_score: 0,
    consciousness_score: 0,
    temperature_score: 0,
    overall_score: undefined,
    overall_severity: undefined,
    overall_score_display: undefined,
    partial_set: false,
    time_next_obs_set_due: undefined,
    obx_reference_range: undefined,
    obx_abnormal_flags: undefined,
    ranking: ''
  };
  let hasNurseConcern = false;
  let severityRanking = 0;
  events.forEach((event: Event): void => {
    switch (event.type) {
      case 'respiratoryRateScore':
        response.respiratory_rate_score = event.params?.value;
        break;
      case 'oxygenSaturationScore':
        response.oxygen_saturation_score = event.params?.value;
        break;
      case 'o2TherapyScore':
        response.o2_therapy_score = event.params?.value;
        break;
      case 'bloodPressureScore':
        response.blood_pressure_score = event.params?.value;
        break;
      case 'heartRateScore':
        response.heart_rate_score = event.params?.value;
        break;
      case 'consciousnessScore':
        response.consciousness_score = event.params?.value;
        break;
      case 'temperatureScore':
        response.temperature_score = event.params?.value;
        break;
      case 'applyPartialSet':
        response.partial_set = true;
        break;
      case 'applyEmptySet':
        // All observations refused and no other obs
        response.empty_set = true;
        break;
      case 'overallSeverity':
        response.overall_severity = event.params?.value;
        break;
      case 'applyNurseConcern':
        hasNurseConcern = true;
        break;
      case 'obxParameters':
        response.obx_reference_range = event.params?.referenceRange;
        response.obx_abnormal_flags = event.params?.abnormalFlags;
        break;
      case 'applyZeroSeverityInterval':
        response.time_next_obs_set_due = obsSet.dateRecorded
          .add(obsSet.zeroSeverityIntervalHours, 'hour')
          .toISOString();
        severityRanking = 0;
        break;
      case 'applyLowSeverityInterval':
        response.time_next_obs_set_due = obsSet.dateRecorded
          .add(obsSet.lowSeverityIntervalHours, 'hour')
          .toISOString();
        severityRanking = 1;
        break;
      case 'applyLowMediumSeverityInterval':
        response.time_next_obs_set_due = obsSet.dateRecorded
          .add(obsSet.lowMediumSeverityIntervalHours, 'hour')
          .toISOString();
        severityRanking = 2;
        break;
      case 'applyMediumSeverityInterval':
        response.time_next_obs_set_due = obsSet.dateRecorded
          .add(obsSet.mediumSeverityIntervalHours, 'hour')
          .toISOString();
        severityRanking = 3;
        break;
      case 'applyHighSeverityInterval':
        response.time_next_obs_set_due = obsSet.dateRecorded
          .add(obsSet.highSeverityIntervalHours, 'hour')
          .toISOString();
        severityRanking = 4;
        break;
      case 'applyZeroMonitoringInstruction':
        response.monitoring_instruction = 'routine_monitoring';
        break;
      case 'applyLowMonitoringInstruction':
        response.monitoring_instruction = 'low_monitoring';
        break;
      case 'applyLowMediumMonitoringInstruction':
        response.monitoring_instruction = 'low_medium_monitoring';
        break;
      case 'applyMediumMonitoringInstruction':
        response.monitoring_instruction = 'medium_monitoring';
        break;
      case 'applyHighMonitoringInstruction':
        response.monitoring_instruction = 'high_monitoring';
        break;
      default:
        throw new Error('Unexpected rule event type ' + event.type);
    }
  });
  response.overall_score =
    response.respiratory_rate_score +
    response.oxygen_saturation_score +
    response.o2_therapy_score +
    response.blood_pressure_score +
    response.heart_rate_score +
    response.consciousness_score +
    response.temperature_score;

  response.overall_score_display = response.overall_score.toString();
  if (hasNurseConcern) {
    response.overall_score_display += 'C';
  } else if (response.empty_set) {
    response.overall_score_display = '--';
  }
  response.ranking = createRankingKey(
    response,
    hasNurseConcern,
    severityRanking,
    obsSet.dateRecorded
  );
  return response;
};

export default news2;
export { news2 as calculateNews2 };
