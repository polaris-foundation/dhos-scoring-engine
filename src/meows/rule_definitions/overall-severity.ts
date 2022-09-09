/*
 * This ruleset determines the MEOWS severity based on the observations' scores.
 * https://sensynehealth.atlassian.net/wiki/spaces/SEND/pages/3544782/MEOWS
 *
 * low: MEOWS score 0 AND no nurse concern
 * low-medium: MEOWS score 2 AND no nurse concern
 * medium: MEOWS score 4-6 AND no nurse concern
 * high: MEOWS score >=7 OR any nurse concern
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
          value: 1.5
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
          operator: 'greaterThanInclusive',
          value: 1.5
        },
        {
          fact: 'overallScore',
          operator: 'lessThan',
          value: 3.5
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
          value: 3.5
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
