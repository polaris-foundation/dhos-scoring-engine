/*
 * This ruleset implements MEOWS scoring for respiratory rate.
 * https://sensynehealth.atlassian.net/wiki/spaces/SEND/pages/3544782/MEOWS
 *
 * 8: RR <= 10 per min
 * 0: RR 11-20 per min
 * 2: RR 21-30 per min
 * 8: RR >= 31 per min
 */
import type {Almanac, Event, RuleProperties} from "json-rules-engine";

const rules: RuleProperties[] = [
  {
    conditions: {
      any: [
        {
          fact: 'respiratoryRate',
          operator: 'lessThan',
          value: 10.5
        },
        {
          fact: 'respiratoryRate',
          operator: 'greaterThanInclusive',
          value: 30.5
        }
      ]
    },
    event: {
      type: 'respiratoryRateScore',
      params: {
        value: 8
      }
    },
    priority: 100,
    onSuccess: function (event: Event, almanac: Almanac) {
      almanac.addRuntimeFact(event.type, event.params?.value);
    }
  },
  {
    conditions: {
      any: [
        {
          all: [
            {
              fact: 'respiratoryRate',
              operator: 'greaterThanInclusive',
              value: 10.5
            },
            {
              fact: 'respiratoryRate',
              operator: 'lessThan',
              value: 20.5
            }
          ]
        },
        {
          fact: 'respiratoryRate',
          operator: 'equal',
          value: 'undefined'
        }
      ]
    },
    event: {
      type: 'respiratoryRateScore',
      params: {
        value: 0
      }
    },
    priority: 100,
    onSuccess: function (event: Event, almanac: Almanac) {
      almanac.addRuntimeFact(event.type, event.params?.value);
    }
  },
  {
    conditions: {
      all: [
        {
          fact: 'respiratoryRate',
          operator: 'greaterThanInclusive',
          value: 20.5
        },
        {
          fact: 'respiratoryRate',
          operator: 'lessThan',
          value: 30.5
        }
      ]
    },
    event: {
      type: 'respiratoryRateScore',
      params: {
        value: 2
      }
    },
    priority: 100,
    onSuccess: function (event: Event, almanac: Almanac) {
      almanac.addRuntimeFact(event.type, event.params?.value);
    }
  }
];

export default rules;
