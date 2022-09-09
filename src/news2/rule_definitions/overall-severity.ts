/*
 * This ruleset determines the NEWS2 severity based on the observations' scores.
 * https://www.rcplondon.ac.uk/projects/outputs/national-early-warning-score-news-2
 *
 * low: NEWS2 score 0-4 AND no individual score of 3 AND no nurse concern
 * low-medium: NEWS2 score 0-4 AND individual score of 3 AND no nurse concern
 * medium: NEWS2 score 5-6 AND no nurse concern
 * high: NEWS2 score >=7 OR any nurse concern
 */
import type {Almanac, Event, RuleProperties} from "json-rules-engine";

const rules: RuleProperties[] = [
  {
    conditions: {
      all: [
        {
          fact: 'nurseConcern',
          operator: 'equal',
          value: 'undefined'
        },
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
      type: 'overallSeverity',
      params: {
        value: 'low'
      }
    },
    priority: 10,
    onSuccess: function (event: Event, almanac: Almanac) {
      almanac.addRuntimeFact(event.type, event.params?.value);
    }
  },
  {
    conditions: {
      all: [
        {
          fact: 'nurseConcern',
          operator: 'equal',
          value: 'undefined'
        },
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
    },
    event: {
      type: 'overallSeverity',
      params: {
        value: 'low-medium'
      }
    },
    priority: 10,
    onSuccess: function (event: Event, almanac: Almanac) {
      almanac.addRuntimeFact(event.type, event.params?.value);
    }
  },
  {
    conditions: {
      all: [
        {
          fact: 'nurseConcern',
          operator: 'equal',
          value: 'undefined'
        },
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
    event: {
      type: 'overallSeverity',
      params: {
        value: 'medium'
      }
    },
    priority: 10,
    onSuccess: function (event: Event, almanac: Almanac) {
      almanac.addRuntimeFact(event.type, event.params?.value);
    }
  },
  {
    conditions: {
      any: [
        {
          fact: 'nurseConcern',
          operator: 'notEqual',
          value: 'undefined'
        },
        {
          fact: 'overallScore',
          operator: 'greaterThanInclusive',
          value: 6.5
        }
      ]
    },
    event: {
      type: 'overallSeverity',
      params: {
        value: 'high'
      }
    },
    priority: 10,
    onSuccess: function (event: Event, almanac: Almanac) {
      almanac.addRuntimeFact(event.type, event.params?.value);
    }
  }
];

export default rules;
