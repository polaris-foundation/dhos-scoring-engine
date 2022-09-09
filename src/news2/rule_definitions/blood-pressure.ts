/*
 * This ruleset implements NEWS2 scoring for blood pressure.
 * https://www.rcplondon.ac.uk/projects/outputs/national-early-warning-score-news-2
 *
 * 3: SBP <= 90 mmHg
 * 2: SBP 91-100 mmHg
 * 1: SBP 101-110 mmHg
 * 0: SBP 111-219 mmHg
 * 3: SBP >= 220 mmHg
 */
import type {Almanac, Event, RuleProperties} from "json-rules-engine";

const rules: RuleProperties[] = [
  {
    conditions: {
      any: [
        {
          fact: 'systolicBloodPressure',
          operator: 'lessThan',
          value: 90.5
        },
        {
          fact: 'systolicBloodPressure',
          operator: 'greaterThanInclusive',
          value: 219.5
        }
      ]
    },
    event: {
      type: 'bloodPressureScore',
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
          fact: 'systolicBloodPressure',
          operator: 'greaterThanInclusive',
          value: 90.5
        },
        {
          fact: 'systolicBloodPressure',
          operator: 'lessThan',
          value: 100.5
        }
      ]
    },
    event: {
      type: 'bloodPressureScore',
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
          fact: 'systolicBloodPressure',
          operator: 'greaterThanInclusive',
          value: 100.5
        },
        {
          fact: 'systolicBloodPressure',
          operator: 'lessThan',
          value: 110.5
        }
      ]
    },
    event: {
      type: 'bloodPressureScore',
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
              fact: 'systolicBloodPressure',
              operator: 'greaterThanInclusive',
              value: 110.5
            },
            {
              fact: 'systolicBloodPressure',
              operator: 'lessThan',
              value: 219.5
            }
          ]
        },
        {
          fact: 'systolicBloodPressure',
          operator: 'equal',
          value: 'undefined'
        }
      ]
    },
    event: {
      type: 'bloodPressureScore',
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
