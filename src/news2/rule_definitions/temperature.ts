/*
 * This ruleset implements NEWS2 scoring for temperature.
 * https://www.rcplondon.ac.uk/projects/outputs/national-early-warning-score-news-2
 *
 * 3: temp <= 35.0 deg C
 * 1: temp 35.1-36.0 deg C
 * 0: temp 36.1 - 38.0 deg C
 * 1: temp 38.1-39.0 deg C
 * 2: temp >= 39.1 deg C
 */
import type {Almanac, Event, RuleProperties} from "json-rules-engine";

const rules: RuleProperties[] = [
  {
    conditions: {
      any: [
        {
          fact: 'temperature',
          operator: 'lessThan',
          value: 35.05
        }
      ]
    },
    event: {
      type: 'temperatureScore',
      params: {
        value: 3
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
          value: 39.05
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
      any: [
        {
          all: [
            {
              fact: 'temperature',
              operator: 'greaterThanInclusive',
              value: 35.05
            },
            {
              fact: 'temperature',
              operator: 'lessThan',
              value: 36.05
            }
          ]
        },
        {
          all: [
            {
              fact: 'temperature',
              operator: 'greaterThanInclusive',
              value: 38.05
            },
            {
              fact: 'temperature',
              operator: 'lessThan',
              value: 39.05
            }
          ]
        }
      ]
    },
    event: {
      type: 'temperatureScore',
      params: {
        value: 1
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
              value: 36.05
            },
            {
              fact: 'temperature',
              operator: 'lessThan',
              value: 38.05
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
