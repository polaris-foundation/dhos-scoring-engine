/*
 * This ruleset implements NEWS2 scoring for spo2 saturation.
 * https://www.rcplondon.ac.uk/projects/outputs/national-early-warning-score-news-2
 *
 * SpO2 scale 1:
 * 3: SpO2 <= 91 %
 * 2: SpO2 92-93 %
 * 1: SpO2 94-95 %
 * 0: SpO2 >=96 %
 *
 * SpO2 scale 2:
 * 3: SpO2 <= 83 %
 * 2: SpO2 84-85 %
 * 1: SpO2 86-87 %
 * 0: SpO2 88-92 % (and also >= 93 % if on air)
 * 1: SpO2 93-94 % AND on O2 therapy
 * 2: SpO2 95-96 % AND on O2 therapy
 * 3: SpO2 >=97 % AND on O2 therapy
 */
import type {Almanac, Event, RuleProperties} from "json-rules-engine";

const rules: RuleProperties[] = [
  {
    conditions: {
      any: [
        {
          all: [
            {
              fact: 'oxygenSaturation',
              operator: 'lessThan',
              value: 91.5
            },
            {
              fact: 'spo2Scale',
              operator: 'equal',
              value: 1
            }
          ]
        },
        {
          all: [
            {
              fact: 'oxygenSaturation',
              operator: 'lessThan',
              value: 83.5
            },
            {
              fact: 'spo2Scale',
              operator: 'equal',
              value: 2
            }
          ]
        },
        {
          all: [
            {
              fact: 'oxygenSaturation',
              operator: 'greaterThanInclusive',
              value: 96.5
            },
            {
              fact: 'spo2Scale',
              operator: 'equal',
              value: 2
            },
            {
              fact: 'o2Therapy',
              operator: 'greaterThan',
              value: 0
            }
          ]
        }
      ]
    },
    event: {
      type: 'oxygenSaturationScore',
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
          all: [
            {
              fact: 'oxygenSaturation',
              operator: 'greaterThanInclusive',
              value: 91.5
            },
            {
              fact: 'oxygenSaturation',
              operator: 'lessThan',
              value: 93.5
            },
            {
              fact: 'spo2Scale',
              operator: 'equal',
              value: 1
            }
          ]
        },
        {
          all: [
            {
              fact: 'oxygenSaturation',
              operator: 'greaterThanInclusive',
              value: 83.5
            },
            {
              fact: 'oxygenSaturation',
              operator: 'lessThan',
              value: 85.5
            },
            {
              fact: 'spo2Scale',
              operator: 'equal',
              value: 2
            }
          ]
        },
        {
          all: [
            {
              fact: 'oxygenSaturation',
              operator: 'greaterThanInclusive',
              value: 94.5
            },
            {
              fact: 'oxygenSaturation',
              operator: 'lessThan',
              value: 96.5
            },
            {
              fact: 'spo2Scale',
              operator: 'equal',
              value: 2
            },
            {
              fact: 'o2Therapy',
              operator: 'greaterThan',
              value: 0
            }
          ]
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
          all: [
            {
              fact: 'oxygenSaturation',
              operator: 'greaterThanInclusive',
              value: 93.5
            },
            {
              fact: 'oxygenSaturation',
              operator: 'lessThan',
              value: 95.5
            },
            {
              fact: 'spo2Scale',
              operator: 'equal',
              value: 1
            }
          ]
        },
        {
          all: [
            {
              fact: 'oxygenSaturation',
              operator: 'greaterThanInclusive',
              value: 85.5
            },
            {
              fact: 'oxygenSaturation',
              operator: 'lessThan',
              value: 87.5
            },
            {
              fact: 'spo2Scale',
              operator: 'equal',
              value: 2
            }
          ]
        },
        {
          all: [
            {
              fact: 'oxygenSaturation',
              operator: 'greaterThan',
              value: 92.5
            },
            {
              fact: 'oxygenSaturation',
              operator: 'lessThan',
              value: 94.5
            },
            {
              fact: 'spo2Scale',
              operator: 'equal',
              value: 2
            },
            {
              fact: 'o2Therapy',
              operator: 'greaterThan',
              value: 0
            }
          ]
        }
      ]
    },
    event: {
      type: 'oxygenSaturationScore',
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
              fact: 'oxygenSaturation',
              operator: 'greaterThanInclusive',
              value: 95.5
            },
            {
              fact: 'spo2Scale',
              operator: 'equal',
              value: 1
            }
          ]
        },
        {
          all: [
            {
              fact: 'oxygenSaturation',
              operator: 'greaterThanInclusive',
              value: 87.5
            },
            {
              fact: 'oxygenSaturation',
              operator: 'lessThan',
              value: 92.5
            },
            {
              fact: 'spo2Scale',
              operator: 'equal',
              value: 2
            }
          ]
        },
        {
          any: [
            {
              all: [
                {
                  fact: 'oxygenSaturation',
                  operator: 'greaterThanInclusive',
                  value: 92.5
                },
                {
                  fact: 'spo2Scale',
                  operator: 'equal',
                  value: 2
                },
                {
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
                }
              ]
            },
            {
              fact: 'oxygenSaturation',
              operator: 'equal',
              value: 'undefined'
            }
          ]
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
