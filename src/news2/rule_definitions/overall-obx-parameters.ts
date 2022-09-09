/*
 * This ruleset determines the parameters to include in the OBX segment if sending
 * ORU (HL7) messages for this set of observations.
 *
 * OBX segment status flag:
 * N: NEWS2 score 0-4 AND no individual score of 3
 * HIGH: NEWS2 score 5-6 OR individual score of 3
 * EXTHIGH: NEWS2 score >= 7
 */
import type {RuleProperties} from "json-rules-engine";

const rules: RuleProperties[] = [
  {
    conditions: {
      all: [
        {
          fact: 'overallScore',
          operator: 'lessThan',
          value: 4.5
        },
        {
          fact: 'bloodPressureScore',
          operator: 'lessThan',
          value: 3
        },
        {
          fact: 'consciousnessScore',
          operator: 'lessThan',
          value: 3
        },
        {
          fact: 'heartRateScore',
          operator: 'lessThan',
          value: 3
        },
        {
          fact: 'o2TherapyScore',
          operator: 'lessThan',
          value: 3
        },
        {
          fact: 'oxygenSaturationScore',
          operator: 'lessThan',
          value: 3
        },
        {
          fact: 'respiratoryRateScore',
          operator: 'lessThan',
          value: 3
        },
        {
          fact: 'temperatureScore',
          operator: 'lessThan',
          value: 3
        }
      ]
    },
    event: {
      type: 'obxParameters',
      params: {
        abnormalFlags: 'N',
        referenceRange: '0-4'
      }
    },
    priority: 1
  },
  {
    conditions: {
      any: [
        {
          all: [
            {
              fact: 'overallScore',
              operator: 'greaterThanInclusive',
              value: 4.5
            },
            {
              fact: 'overallScore',
              operator: 'lessThan',
              value: 6.5
            }
          ]
        },
        {
          all: [
            {
              fact: 'overallScore',
              operator: 'lessThan',
              value: 4.5
            },
            {
              any: [
                {
                  fact: 'bloodPressureScore',
                  operator: 'greaterThanInclusive',
                  value: 3
                },
                {
                  fact: 'consciousnessScore',
                  operator: 'greaterThanInclusive',
                  value: 3
                },
                {
                  fact: 'heartRateScore',
                  operator: 'greaterThanInclusive',
                  value: 3
                },
                {
                  fact: 'o2TherapyScore',
                  operator: 'greaterThanInclusive',
                  value: 3
                },
                {
                  fact: 'oxygenSaturationScore',
                  operator: 'greaterThanInclusive',
                  value: 3
                },
                {
                  fact: 'respiratoryRateScore',
                  operator: 'greaterThanInclusive',
                  value: 3
                },
                {
                  fact: 'temperatureScore',
                  operator: 'greaterThanInclusive',
                  value: 3
                }
              ]
            }
          ]
        }

      ]
    },
    event: {
      type: 'obxParameters',
      params: {
        abnormalFlags: 'HIGH',
        referenceRange: '0-4'
      }
    },
    priority: 1
  },
  {
    conditions: {
      any: [
        {
          fact: 'overallScore',
          operator: 'greaterThanInclusive',
          value: 6.5
        }
      ]
    },
    event: {
      type: 'obxParameters',
      params: {
        abnormalFlags: 'EXTHIGH',
        referenceRange: '0-4'
      }
    },
    priority: 1
  }
];

export default rules;
