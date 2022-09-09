/*
 * This ruleset determines the parameters to include in the OBX segment if sending
 * ORU (HL7) messages for this set of observations.
 *
 * OBX segment status flag:
 * N: MEOWS score 0
 * HIGH: MEOWS score 2-6
 * EXTHIGH: MEOWS score >= 7
 */
import type {RuleProperties} from "json-rules-engine";

const rules: RuleProperties[] = [
  {
    conditions: {
      all: [
        {
          fact: 'overallScore',
          operator: 'lessThan',
          value: 1.5
        }
      ]
    },
    event: {
      type: 'obxParameters',
      params: {
        abnormalFlags: 'N',
        referenceRange: '0'
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
              value: 1.5
            },
            {
              fact: 'overallScore',
              operator: 'lessThan',
              value: 6.5
            }
          ]
        }
      ]
    },
    event: {
      type: 'obxParameters',
      params: {
        abnormalFlags: 'HIGH',
        referenceRange: '0'
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
        referenceRange: '0'
      }
    },
    priority: 1
  }
];

export default rules;
