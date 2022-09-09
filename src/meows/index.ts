import dayjs from 'dayjs';
import {MeowsEngine} from './engine';
import normaliseAcvpu from '../shared/normaliseAcvpu';
import createRankingKey from '../shared/createRankingKey';
import valueOrUndefinedStr from '../shared/valueOrUndefinedStr';
import validateInputs from '../shared/validateInputs';
import type {Event} from 'json-rules-engine';
import type {MeowsFields, MeowsInputs, MeowsResponse, Unvalidated} from "../interfaces";

/* eslint-disable @typescript-eslint/no-use-before-define */

type MeowsObsSet = Pick<MeowsFields, Exclude<keyof MeowsFields, 'dateRecorded'>> & {
  dateRecorded: dayjs.Dayjs;
}

const meows = async (inputs: Partial<MeowsInputs>): Promise<MeowsResponse> => {
  const unvalidatedObs: Unvalidated<MeowsFields> = await defaultInputs(inputs);
  const intermediate: MeowsFields = await validateInputs(unvalidatedObs);

  // Normalise special inputs
  const validatedObs: MeowsObsSet = {
    ...intermediate,
    dateRecorded: dayjs(intermediate.dateRecorded),
    consciousnessAcvpu: await normaliseAcvpu(
      intermediate.consciousnessAcvpu
    )
  };

  // Run the engine to evaluate
  const {events} = await MeowsEngine.run(validatedObs);
  return parseEventsToResponse(events, validatedObs);
};

const defaultInputs = async (inputs: Partial<MeowsInputs>): Promise<Unvalidated<MeowsFields>> => {
  if (typeof inputs.config === 'undefined') {
    inputs.config = {};
  }

  return {
    dateRecorded: valueOrUndefinedStr(inputs['time']),
    respiratoryRate: valueOrUndefinedStr(inputs['respiratory_rate']),
    heartRate: valueOrUndefinedStr(inputs['heart_rate']),
    oxygenSaturation: valueOrUndefinedStr(inputs['oxygen_saturation']),
    systolicBloodPressure: valueOrUndefinedStr(
        inputs['systolic_blood_pressure']
    ),
    diastolicBloodPressure: valueOrUndefinedStr(
        inputs['diastolic_blood_pressure']
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

const parseEventsToResponse = async (events: Event[], obsSet: MeowsObsSet): Promise<MeowsResponse> => {
  const response: MeowsResponse = {
    respiratory_rate_score: 0,
    oxygen_saturation_score: 0,
    systolic_blood_pressure_score: 0,
    diastolic_blood_pressure_score: 0,
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
  events.forEach(event => {
    switch (event.type) {
      case 'respiratoryRateScore':
        response.respiratory_rate_score = event.params?.value;
        break;
      case 'oxygenSaturationScore':
        response.oxygen_saturation_score = event.params?.value;
        break;
      case 'systolicBloodPressureScore':
        response.systolic_blood_pressure_score = event.params?.value;
        break;
      case 'diastolicBloodPressureScore':
        response.diastolic_blood_pressure_score = event.params?.value;
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
    response.systolic_blood_pressure_score +
    response.diastolic_blood_pressure_score +
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

export default meows;
export { meows as calculateMeows };
