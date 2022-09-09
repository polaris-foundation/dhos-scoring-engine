/*
 * This ruleset implements MEOWS scoring for heart rate.
 * https://sensynehealth.atlassian.net/wiki/spaces/SEND/pages/3544782/MEOWS
 *
 * 8: HR <= 40 bpm
 * 2: HR 41-60 bpm
 * 0: HR 61-100 bpm
 * 2: HR 101-120 bpm
 * 8: HR >= 120 bpm
 */
import type {Almanac, Event, RuleProperties} from "json-rules-engine";
const rules: RuleProperties[] = [
  {
    conditions: {
      any: [
        {
          fact: 'heartRate',
          operator: 'lessThan',
          value: 40.5
        },
        {
          fact: 'heartRate',
          operator: 'greaterThanInclusive',
          value: 120.5
        }
      ]
    },
    event: {
      type: 'heartRateScore',
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
          fact: 'heartRate',
          operator: 'equal',
          value: 'undefined'
        },
        {
          all: [
            {
              fact: 'heartRate',
              operator: 'greaterThanInclusive',
              value: 60.5
            },
            {
              fact: 'heartRate',
              operator: 'lessThan',
              value: 100.5
            }
          ]
        }
      ]
    },
    event: {
      type: 'heartRateScore',
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
      any: [
        {
          all: [
            {
              fact: 'heartRate',
              operator: 'greaterThanInclusive',
              value: 40.5
            },
            {
              fact: 'heartRate',
              operator: 'lessThan',
              value: 60.5
            }
          ]
        },
        {
          all: [
            {
              fact: 'heartRate',
              operator: 'greaterThanInclusive',
              value: 100.5
            },
            {
              fact: 'heartRate',
              operator: 'lessThan',
              value: 120.5
            }
          ]
        }
      ]
    },
    event: {
      type: 'heartRateScore',
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
