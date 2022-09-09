/*
 * This ruleset triggers an event when no observations are included in the obs set.
 * An empty obs set is displayed differently by the SEND UI (-- instead of 0).
 */
import buildEmptySetRules from '../../shared/buildEmptySetRules';
import type {RuleProperties} from "json-rules-engine";

const conditions = [
  'respiratoryRate',
  'heartRate',
  'oxygenSaturation',
  'systolicBloodPressure',
  'diastolicBloodPressure',
  'consciousnessAcvpu',
  'temperature',
  'nurseConcern'
];

const rules: RuleProperties[] = buildEmptySetRules(conditions);
export default rules;
