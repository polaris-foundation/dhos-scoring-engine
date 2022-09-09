/*
 * This ruleset implements MEOWS scoring for systolic blood pressure.
 * https://sensynehealth.atlassian.net/wiki/spaces/SEND/pages/3544782/MEOWS
 *
 * 8: SBP <90	mmHg
 * 2: SBP 90-100 mmHg
 * 0: SBP 101-150 mmHg
 * 2: SBP 151-160 mmHg
 * 8: SBP >160 mmHg
 *
 */
import type {Almanac, Event, RuleProperties} from "json-rules-engine";

const rules: RuleProperties[] = [
  {
    conditions: {
      any: [
        {
          fact: 'systolicBloodPressure',
          operator: 'lessThan',
          value: 89.5
        },
        {
          fact: 'systolicBloodPressure',
          operator: 'greaterThanInclusive',
          value: 160.5
        }
      ]
    },
    event: {
      type: 'systolicBloodPressureScore',
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
          fact: 'systolicBloodPressure',
          operator: 'greaterThanInclusive',
          value: 89.5
        },
        {
          fact: 'systolicBloodPressure',
          operator: 'lessThan',
          value: 100.5
        }
      ]
    },
    event: {
      type: 'systolicBloodPressureScore',
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
          value: 150.5
        }
      ]
    },
    event: {
      type: 'systolicBloodPressureScore',
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
      any: [
        {
          fact: 'systolicBloodPressure',
          operator: 'equal',
          value: 'undefined'
        }
      ]
    },
    event: {
      type: 'systolicBloodPressureScore',
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
          fact: 'systolicBloodPressure',
          operator: 'greaterThanInclusive',
          value: 150.5
        },
        {
          fact: 'systolicBloodPressure',
          operator: 'lessThan',
          value: 160.5
        }
      ]
    },
    event: {
      type: 'systolicBloodPressureScore',
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
