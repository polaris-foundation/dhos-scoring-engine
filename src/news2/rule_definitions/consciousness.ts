/*
 * This ruleset implements NEWS2 scoring for consciousness.
 * https://www.rcplondon.ac.uk/projects/outputs/national-early-warning-score-news-2
 *
 * 0: ACVPU of A
 * 3: ACVPU of C/V/P/U
 */
import type {Almanac, Event, RuleProperties} from "json-rules-engine";

const rules: RuleProperties[] = [
  {
    conditions: {
      any: [
        {
          fact: 'consciousnessAcvpu',
          operator: 'notEqual',
          value: 'alert'
        }
      ]
    },
    event: {
      type: 'consciousnessScore',
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
      any: [
        {
          fact: 'consciousnessAcvpu',
          operator: 'equal',
          value: 'alert'
        },
        {
          fact: 'consciousnessAcvpu',
          operator: 'equal',
          value: 'undefined'
        }
      ]
    },
    event: {
      type: 'consciousnessScore',
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
