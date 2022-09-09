/*
 * This ruleset implements NEWS2 scoring for O2 therapy.
 * https://www.rcplondon.ac.uk/projects/outputs/national-early-warning-score-news-2
 *
 * 0: O2 flow rate 0 L/min
 * 2: O2 flow rate >0 L/min
 */
import type {Almanac, Event, RuleProperties} from "json-rules-engine";

const rules: RuleProperties[] = [
  {
    conditions: {
      any: [
        {
          fact: 'o2Therapy',
          operator: 'greaterThan',
          value: 0
        }
      ]
    },
    event: {
      type: 'o2TherapyScore',
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
          fact: 'o2Therapy',
          operator: 'equal',
          value: 0
        },
        {
          fact: 'o2Therapy',
          operator: 'equal',
          value: 'undefined'
        }
      ]
    },
    event: {
      type: 'o2TherapyScore',
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
