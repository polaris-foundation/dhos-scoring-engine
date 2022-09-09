/*
 * This ruleset implements MEOWS scoring for consciousness.
 * https://sensynehealth.atlassian.net/wiki/spaces/SEND/pages/3544782/MEOWS
 *
 * 0: ACVPU of A
 * 2: ACVPU of C
 * 8: ACVPU of V/P/U
 */
import type {Almanac, Event, RuleProperties} from "json-rules-engine";

const rules: RuleProperties[] = [
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
    onSuccess: function (event: Event, almanac: Almanac): void {
      almanac.addRuntimeFact(event.type, event.params?.value);
    }
  },
  {
    conditions: {
      any: [
        {
          fact: 'consciousnessAcvpu',
          operator: 'equal',
          value: 'confusion'
        }
      ]
    },
    event: {
      type: 'consciousnessScore',
      params: {
        value: 2
      }
    },
    priority: 100,
    onSuccess: function (event: Event, almanac: Almanac): void {
      almanac.addRuntimeFact(event.type, event.params?.value);
    }
  },
  {
    conditions: {
      any: [
        {
          fact: 'consciousnessAcvpu',
          operator: 'equal',
          value: 'voice'
        },
        {
          fact: 'consciousnessAcvpu',
          operator: 'equal',
          value: 'pain'
        },
        {
          fact: 'consciousnessAcvpu',
          operator: 'equal',
          value: 'unresponsive'
        }
      ]
    },
    event: {
      type: 'consciousnessScore',
      params: {
        value: 8
      }
    },
    priority: 100,
    onSuccess: function (event: Event, almanac: Almanac) {
      almanac.addRuntimeFact(event.type, event.params?.value);
    }
  }
];

export default rules;
