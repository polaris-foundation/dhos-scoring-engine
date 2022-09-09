/*
 * This ruleset is used to determine whether the observation set should be
 * considered a partial set of observations. This affects how the obs are
 * displayed in the SEND UI.
 */
import type {RuleProperties} from "json-rules-engine";

const rules: RuleProperties[] = [
  {
    conditions: {
      any: [
        {
          fact: 'respiratoryRate',
          operator: 'equal',
          value: 'undefined'
        },
        {
          fact: 'oxygenSaturation',
          operator: 'equal',
          value: 'undefined'
        },
        {
          fact: 'systolicBloodPressure',
          operator: 'equal',
          value: 'undefined'
        },
        {
          fact: 'diastolicBloodPressure',
          operator: 'equal',
          value: 'undefined'
        },
        {
          fact: 'heartRate',
          operator: 'equal',
          value: 'undefined'
        },
        {
          fact: 'consciousnessAcvpu',
          operator: 'equal',
          value: 'undefined'
        },
        {
          fact: 'temperature',
          operator: 'equal',
          value: 'undefined'
        }
      ]
    },
    event: {
      type: 'applyPartialSet'
    },
    priority: 1
  }
];

export default rules;
