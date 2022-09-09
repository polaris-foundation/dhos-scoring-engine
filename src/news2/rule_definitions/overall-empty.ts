/*
 * This ruleset triggers an event when no observations are included in the obs set.
 * An empty obs set is displayed differently by the SEND UI (-- instead of 0).
 */

import buildEmptySetRules from '../../shared/buildEmptySetRules';

const conditions = [
  'respiratoryRate',
  'heartRate',
  'oxygenSaturation',
  'systolicBloodPressure',
  'o2Therapy',
  'consciousnessAcvpu',
  'temperature',
  'nurseConcern'
];

const rules = buildEmptySetRules(conditions);
export default rules;
