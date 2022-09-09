import type {RuleProperties} from "json-rules-engine";
import {
  respRateRules,
  oxygenSaturationRules,
  diastolicBloodPressureRules,
  systolicBloodPressureRules,
  heartRateRules,
  consciousnessRules,
  temperatureRules,
  nurseConcernRules,
  overallPartialRules,
  overallEmptyRules,
  overallSeverityRules,
  overallIntervalRules,
  overallMonitoringInstructionRules,
  overallObxParametersRules
} from './rule_definitions';

const rules: RuleProperties[] = [
  ...respRateRules,
  ...oxygenSaturationRules,
  ...diastolicBloodPressureRules,
  ...systolicBloodPressureRules,
  ...heartRateRules,
  ...consciousnessRules,
  ...temperatureRules,
  ...nurseConcernRules,
  ...overallPartialRules,
  ...overallEmptyRules,
  ...overallSeverityRules,
  ...overallIntervalRules,
  ...overallMonitoringInstructionRules,
  ...overallObxParametersRules
];

export default rules;
