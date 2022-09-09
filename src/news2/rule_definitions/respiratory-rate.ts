/*
 * This ruleset implements NEWS2 scoring for respiratory rate.
 * https://www.rcplondon.ac.uk/projects/outputs/national-early-warning-score-news-2
 *
 * 3: RR <= 8 per min
 * 1: RR 9-11 per min
 * 0: RR 12-20 per min
 * 2: RR 21-24 per min
 * 3: RR >= 25 per min
 */
import type {Almanac, Event, RuleProperties} from "json-rules-engine";

const rules: RuleProperties[] = [
  {
    conditions: {
      any: [
        {
          fact: 'respiratoryRate',
          operator: 'lessThan',
          value: 8.5
        },
        {
          fact: 'respiratoryRate',
          operator: 'greaterThanInclusive',
          value: 24.5
        }
      ]
    },
    event: {
      type: 'respiratoryRateScore',
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
          fact: 'respiratoryRate',
          operator: 'greaterThanInclusive',
          value: 20.5
        },
        {
          fact: 'respiratoryRate',
          operator: 'lessThan',
          value: 24.5
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
  },
  {
    conditions: {
      all: [
        {
          fact: 'respiratoryRate',
          operator: 'greaterThan',
          value: 8.5
        },
        {
          fact: 'respiratoryRate',
          operator: 'lessThanInclusive',
          value: 11.5
        }
      ]
    },
    event: {
      type: 'respiratoryRateScore',
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
              fact: 'respiratoryRate',
              operator: 'greaterThan',
              value: 11.5
            },
            {
              fact: 'respiratoryRate',
              operator: 'lessThanInclusive',
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
  }
];

export default rules;
