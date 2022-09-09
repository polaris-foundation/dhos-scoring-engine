/*
 * This ruleset implements MEOWS scoring for temperature.
 * https://sensynehealth.atlassian.net/wiki/spaces/SEND/pages/3544782/MEOWS
 *
 * 2: temp < 35.5 deg C
 * 0: temp 35.5 - 37.5 deg C
 * 2: temp 37.6-38.0 deg C
 * 8: temp >= 38.1 deg C
 */
import type {Almanac, Event, RuleProperties} from "json-rules-engine";

const rules: RuleProperties[] = [
  {
    conditions: {
      any: [
        {
          fact: 'temperature',
          operator: 'lessThan',
          value: 35.45
        },
        {
          all: [
            {
              fact: 'temperature',
              operator: 'greaterThanInclusive',
              value: 37.55
            },
            {
              fact: 'temperature',
              operator: 'lessThan',
              value: 38.05
            }
          ]
        }
      ]
    },
    event: {
      type: 'temperatureScore',
      params: {
        value: 2
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
          fact: 'temperature',
          operator: 'greaterThanInclusive',
          value: 38.05
        }
      ]
    },
    event: {
      type: 'temperatureScore',
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
              fact: 'temperature',
              operator: 'greaterThanInclusive',
              value: 35.45
            },
            {
              fact: 'temperature',
              operator: 'lessThan',
              value: 37.55
            }
          ]
        },
        {
          fact: 'temperature',
          operator: 'equal',
          value: 'undefined'
        }
      ]
    },
    event: {
      type: 'temperatureScore',
      params: {
        value: 0
      }
    },
    priority: 100,
    onSuccess: function (event: Event, almanac: Almanac) {
      almanac.addRuntimeFact(event.type, event.params?.value);
    }
  }
];

export default rules;
