/*
 * This ruleset implements MEOWS scoring for spo2 saturation.
 * https://sensynehealth.atlassian.net/wiki/spaces/SEND/pages/3544782/MEOWS
 *
 * SpO2 scale 1:
 * 8: SpO2 <= 92 %
 * 2: SpO2 92-95 %
 * 0: SpO2 96-100 %
 *
 */
import type {Almanac, Event, RuleProperties} from "json-rules-engine";

const rules: RuleProperties[] = [
  {
    conditions: {
      all: [
        {
          fact: 'oxygenSaturation',
          operator: 'lessThan',
          value: 91.5
        }
      ]
    },
    event: {
      type: 'oxygenSaturationScore',
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
      all: [
        {
          fact: 'oxygenSaturation',
          operator: 'greaterThanInclusive',
          value: 91.5
        },
        {
          fact: 'oxygenSaturation',
          operator: 'lessThan',
          value: 95.5
        }
      ]
    },
    event: {
      type: 'oxygenSaturationScore',
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
          fact: 'oxygenSaturation',
          operator: 'greaterThanInclusive',
          value: 95.5
        },
        {
          fact: 'oxygenSaturation',
          operator: 'equal',
          value: 'undefined'
        }
      ]
    },
    event: {
      type: 'oxygenSaturationScore',
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
