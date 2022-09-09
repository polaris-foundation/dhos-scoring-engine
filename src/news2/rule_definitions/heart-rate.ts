/*
 * This ruleset implements NEWS2 scoring for heart rate.
 * https://www.rcplondon.ac.uk/projects/outputs/national-early-warning-score-news-2
 *
 * 3: HR <= 40 bpm
 * 1: HR 41-50 bpm
 * 0: HR 51-90 bpm
 * 1: HR 91-110 bpm
 * 2: HR 111-130 bpm
 * 3: HR >= 131 bpm
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
          value: 130.5
        }
      ]
    },
    event: {
      type: 'heartRateScore',
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
          fact: 'heartRate',
          operator: 'greaterThanInclusive',
          value: 110.5
        },
        {
          fact: 'heartRate',
          operator: 'lessThan',
          value: 130.5
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
              value: 50.5
            }
          ]
        },
        {
          all: [
            {
              fact: 'heartRate',
              operator: 'greaterThanInclusive',
              value: 90.5
            },
            {
              fact: 'heartRate',
              operator: 'lessThan',
              value: 110.5
            }
          ]
        }
      ]
    },
    event: {
      type: 'heartRateScore',
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
              fact: 'heartRate',
              operator: 'greaterThanInclusive',
              value: 50.5
            },
            {
              fact: 'heartRate',
              operator: 'lessThan',
              value: 90.5
            }
          ]
        },
        {
          fact: 'heartRate',
          operator: 'equal',
          value: 'undefined'
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
  }
];

export default rules;
