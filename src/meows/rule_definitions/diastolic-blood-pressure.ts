/*
 * This ruleset implements MEOWS scoring for diastolic blood pressure.
 * https://sensynehealth.atlassian.net/wiki/spaces/SEND/pages/3544782/MEOWS
 *
 * 2: DBP <40 mmHg
 * 0: DBP 40-100 mmHg
 * 2: DBP 101-110 mmHg
 * 8: DBP >110 mmHg
 *
 */
import type {Almanac, Event, RuleProperties} from "json-rules-engine";

const rules: RuleProperties[] = [
  {
    conditions: {
      any: [
        {
          fact: 'diastolicBloodPressure',
          operator: 'lessThan',
          value: 39.5
        }
      ]
    },
    event: {
      type: 'diastolicBloodPressureScore',
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
          fact: 'diastolicBloodPressure',
          operator: 'greaterThanInclusive',
          value: 110.5
        }
      ]
    },
    event: {
      type: 'diastolicBloodPressureScore',
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
      any: [
        {
          all: [
            {
              fact: 'diastolicBloodPressure',
              operator: 'greaterThanInclusive',
              value: 39.5
            },
            {
              fact: 'diastolicBloodPressure',
              operator: 'lessThan',
              value: 100.5
            }
          ]
        },
        {
          fact: 'diastolicBloodPressure',
          operator: 'equal',
          value: 'undefined'
        }
      ]
    },
    event: {
      type: 'diastolicBloodPressureScore',
      params: {
        value: 0
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
          fact: 'diastolicBloodPressure',
          operator: 'greaterThanInclusive',
          value: 100.5
        },
        {
          fact: 'diastolicBloodPressure',
          operator: 'lessThan',
          value: 110.5
        }
      ]
    },
    event: {
      type: 'diastolicBloodPressureScore',
      params: {
        value: 2
      }
    },
    priority: 100,
    onSuccess: function (event: Event, almanac: Almanac) {
      almanac.addRuntimeFact(event.type, event.params?.value);
    }
  }
];

export default rules;
