import allTestCases from './cases/bg_readings/thresholds.json';

import {
  compileThresholdsToRules,
  flattenThresholdsHigh,
  flattenThresholdsLow,
  flattenThresholdsNormal,
  flatThresholdsToBgRule
} from '../src/blood-glucose-banding/compile_thresholds';
import '../src/blood-glucose-banding/interfaces';
import * as RulesEngine from "json-rules-engine";
import {BloodGlucoseThreshold} from "../src/blood-glucose-banding/interfaces";

interface ThresholdTestData {
  id: string;
  blood_glucose_thresholds: BloodGlucoseThreshold;
  expected: RulesEngine.RuleProperties[];
}

(allTestCases as ThresholdTestData[]).forEach((testCase: ThresholdTestData) => {
  describe(`Test blood glucose boundaries using case ${testCase.id}`, () => {
    test('It should match the expected output', () => {
      const actual = compileThresholdsToRules(
        testCase.blood_glucose_thresholds
      );
      expect(actual).toEqual(testCase.expected);
    });
  });
});

describe('Flatten bg thresholds', () => {
  const config_data = {
    'BEFORE-BREAKFAST': { high: 5.3, low: 4.0 },
    'AFTER-DINNER': { high: 7.8, low: 4.0 },
    OTHER: { high: 7.8, low: 4.0 }
  };

  test('low threshold only returns `other`', () => {
    const other = { greaterThanInclusive: null, lessThan: null, exclude: [] };
    const actual_thresholds = flattenThresholdsLow(config_data, other);
    const expected_other = {
      greaterThanInclusive: 0,
      lessThan: 4.0,
      exclude: []
    };
    const expected_thresholds: unknown[] = [];
    expect(actual_thresholds).toEqual(expected_thresholds);
    expect(other).toEqual(expected_other);
  });

  test('normal threshold returns `other` and before-breakfast', () => {
    const other = { greaterThanInclusive: null, lessThan: null, exclude: [] };
    const actual_thresholds = flattenThresholdsNormal(config_data, other);
    const expected_other = {
      greaterThanInclusive: 4.0,
      lessThan: 7.8,
      exclude: ['PRANDIAL-TAG-BEFORE-BREAKFAST']
    };
    const expected_thresholds = [
      {
        greaterThanInclusive: 4.0,
        lessThan: 5.3,
        include: ['PRANDIAL-TAG-BEFORE-BREAKFAST']
      }
    ];
    expect(actual_thresholds).toEqual(expected_thresholds);
    expect(other).toEqual(expected_other);
  });

  test('high threshold returns `other` sub range not excluded', () => {
    const other = { greaterThanInclusive: null, lessThan: null, exclude: [] };
    const actual_thresholds = flattenThresholdsHigh(config_data, other);
    const expected_other = {
      greaterThanInclusive: 7.8,
      lessThan: null,
      exclude: []
    };
    const expected_thresholds = [
      {
        greaterThanInclusive: 5.3,
        lessThan: null,
        include: ['PRANDIAL-TAG-BEFORE-BREAKFAST']
      }
    ];
    expect(actual_thresholds).toEqual(expected_thresholds);
    expect(other).toEqual(expected_other);
  });
});

describe('Flatten realistic thresholds', () => {
  const config_data = {
    'BEFORE-BREAKFAST': { high: 5.3, low: 4.0 },
    'AFTER-BREAKFAST': { high: 7.8, low: 4.0 },
    'BEFORE-LUNCH': { high: 6.0, low: 4.0 },
    'AFTER-LUNCH': { high: 7.8, low: 4.0 },
    'BEFORE-DINNER': { high: 6.0, low: 4.0 },
    'AFTER-DINNER': { high: 7.8, low: 4.0 },
    OTHER: { high: 7.8, low: 4.0 }
  };

  test('low threshold returns only `other`', () => {
    const other = { greaterThanInclusive: null, lessThan: null, exclude: [] };
    const actual_thresholds = flattenThresholdsLow(config_data, other);
    const expected_other = {
      greaterThanInclusive: 0,
      lessThan: 4.0,
      exclude: []
    };
    const expected_thresholds: unknown[] = [];
    expect(actual_thresholds).toEqual(expected_thresholds);
    expect(other).toEqual(expected_other);
  });

  test('normal threshold returns multiple', () => {
    const other = { greaterThanInclusive: null, lessThan: null, exclude: [] };
    const actual_thresholds = flattenThresholdsNormal(config_data, other);
    const expected_other = {
      greaterThanInclusive: 4.0,
      lessThan: 7.8,
      exclude: [
        'PRANDIAL-TAG-BEFORE-BREAKFAST',
        'PRANDIAL-TAG-BEFORE-LUNCH',
        'PRANDIAL-TAG-BEFORE-DINNER'
      ]
    };
    const expected_thresholds = [
      {
        greaterThanInclusive: 4.0,
        lessThan: 5.3,
        include: ['PRANDIAL-TAG-BEFORE-BREAKFAST']
      },
      {
        greaterThanInclusive: 4.0,
        lessThan: 6.0,
        include: ['PRANDIAL-TAG-BEFORE-LUNCH', 'PRANDIAL-TAG-BEFORE-DINNER']
      }
    ];
    expect(actual_thresholds).toEqual(expected_thresholds);
    expect(other).toEqual(expected_other);
  });

  test('high threshold returns `other` without excluding subranges', () => {
    const other = { greaterThanInclusive: null, lessThan: null, exclude: [] };
    const actual_thresholds = flattenThresholdsHigh(config_data, other);
    const expected_other = {
      greaterThanInclusive: 7.8,
      lessThan: null,
      exclude: []
    };
    const expected_thresholds = [
      {
        greaterThanInclusive: 5.3,
        lessThan: null,
        include: ['PRANDIAL-TAG-BEFORE-BREAKFAST']
      },
      {
        greaterThanInclusive: 6.0,
        lessThan: null,
        include: ['PRANDIAL-TAG-BEFORE-LUNCH', 'PRANDIAL-TAG-BEFORE-DINNER']
      }
    ];
    expect(actual_thresholds).toEqual(expected_thresholds);
    expect(other).toEqual(expected_other);
  });
});

describe('Thresholds to BG rule', () => {
  test('low threshold only tests range', () => {
    const other = { greaterThanInclusive: 0, lessThan: 4.0, exclude: [] };
    const actual_rule = flatThresholdsToBgRule(
      other,
      [],
      'BG-READING-BANDING-LOW'
    );
    const expected_rule = {
      conditions: {
        all: [
          {
            fact: 'bloodGlucoseValue',
            operator: 'greaterThanInclusive',
            value: 0
          },
          {
            fact: 'bloodGlucoseValue',
            operator: 'lessThan',
            value: 4.0
          }
        ]
      },
      event: {
        type: 'bloodGlucoseReadingBanding',
        params: {
          level: 'BG-READING-BANDING-LOW'
        }
      }
    };
    expect(actual_rule).toEqual(expected_rule);
  });

  test('normal threshold handles before-breakfast and other', () => {
    const other = {
      greaterThanInclusive: 4.0,
      lessThan: 7.8,
      exclude: ['PRANDIAL-TAG-BEFORE-BREAKFAST']
    };
    const thresholds = [
      {
        greaterThanInclusive: 4.0,
        lessThan: 5.3,
        include: ['PRANDIAL-TAG-BEFORE-BREAKFAST']
      }
    ];
    const actual_rule = flatThresholdsToBgRule(
      other,
      thresholds,
      'BG-READING-BANDING-NORMAL'
    );
    const expected_rule = {
      conditions: {
        any: [
          {
            all: [
              {
                fact: 'bloodGlucoseValue',
                operator: 'greaterThanInclusive',
                value: 4.0
              },
              {
                fact: 'bloodGlucoseValue',
                operator: 'lessThan',
                value: 5.3
              },
              {
                fact: 'prandialTagId',
                operator: 'equal',
                value: 'PRANDIAL-TAG-BEFORE-BREAKFAST'
              }
            ]
          },
          {
            all: [
              {
                fact: 'bloodGlucoseValue',
                operator: 'greaterThanInclusive',
                value: 4.0
              },
              {
                fact: 'bloodGlucoseValue',
                operator: 'lessThan',
                value: 7.8
              },
              {
                fact: 'prandialTagId',
                operator: 'notEqual',
                value: 'PRANDIAL-TAG-BEFORE-BREAKFAST'
              }
            ]
          }
        ]
      },
      event: {
        type: 'bloodGlucoseReadingBanding',
        params: {
          level: 'BG-READING-BANDING-NORMAL'
        }
      }
    };
    expect(actual_rule).toEqual(expected_rule);
  });

  test('high threshold handles before-breakfast and other', () => {
    const other = { greaterThanInclusive: 7.8, lessThan: null, exclude: [] };
    const thresholds = [
      {
        greaterThanInclusive: 5.3,
        lessThan: null,
        include: ['PRANDIAL-TAG-BEFORE-BREAKFAST']
      }
    ];
    const actual_rule = flatThresholdsToBgRule(
      other,
      thresholds,
      'BG-READING-BANDING-HIGH'
    );
    const expected_rule = {
      conditions: {
        any: [
          {
            all: [
              {
                fact: 'bloodGlucoseValue',
                operator: 'greaterThanInclusive',
                value: 5.3
              },
              {
                fact: 'prandialTagId',
                operator: 'equal',
                value: 'PRANDIAL-TAG-BEFORE-BREAKFAST'
              }
            ]
          },
          {
            fact: 'bloodGlucoseValue',
            operator: 'greaterThanInclusive',
            value: 7.8
          }
        ]
      },
      event: {
        type: 'bloodGlucoseReadingBanding',
        params: {
          level: 'BG-READING-BANDING-HIGH'
        }
      }
    };
    expect(actual_rule).toEqual(expected_rule);
  });

  test('realistic normal thresholds', () => {
    const other = {
      greaterThanInclusive: 4.0,
      lessThan: 7.8,
      exclude: [
        'PRANDIAL-TAG-BEFORE-BREAKFAST',
        'PRANDIAL-TAG-BEFORE-LUNCH',
        'PRANDIAL-TAG-BEFORE-DINNER'
      ]
    };
    const thresholds = [
      {
        greaterThanInclusive: 4.0,
        lessThan: 5.3,
        include: ['PRANDIAL-TAG-BEFORE-BREAKFAST']
      },
      {
        greaterThanInclusive: 4.0,
        lessThan: 6.0,
        include: ['PRANDIAL-TAG-BEFORE-LUNCH', 'PRANDIAL-TAG-BEFORE-DINNER']
      }
    ];
    const actual_rule = flatThresholdsToBgRule(
      other,
      thresholds,
      'BG-READING-BANDING-NORMAL'
    );
    const expected_rule = {
      conditions: {
        any: [
          {
            all: [
              {
                fact: 'bloodGlucoseValue',
                operator: 'greaterThanInclusive',
                value: 4.0
              },
              {
                fact: 'bloodGlucoseValue',
                operator: 'lessThan',
                value: 5.3
              },
              {
                fact: 'prandialTagId',
                operator: 'equal',
                value: 'PRANDIAL-TAG-BEFORE-BREAKFAST'
              }
            ]
          },
          {
            all: [
              {
                fact: 'bloodGlucoseValue',
                operator: 'greaterThanInclusive',
                value: 4.0
              },
              {
                fact: 'bloodGlucoseValue',
                operator: 'lessThan',
                value: 6.0
              },
              {
                fact: 'prandialTagId',
                operator: 'in',
                value: [
                  'PRANDIAL-TAG-BEFORE-LUNCH',
                  'PRANDIAL-TAG-BEFORE-DINNER'
                ]
              }
            ]
          },
          {
            all: [
              {
                fact: 'bloodGlucoseValue',
                operator: 'greaterThanInclusive',
                value: 4.0
              },
              {
                fact: 'bloodGlucoseValue',
                operator: 'lessThan',
                value: 7.8
              },
              {
                fact: 'prandialTagId',
                operator: 'notIn',
                value: [
                  'PRANDIAL-TAG-BEFORE-BREAKFAST',
                  'PRANDIAL-TAG-BEFORE-LUNCH',
                  'PRANDIAL-TAG-BEFORE-DINNER'
                ]
              }
            ]
          }
        ]
      },
      event: {
        type: 'bloodGlucoseReadingBanding',
        params: {
          level: 'BG-READING-BANDING-NORMAL'
        }
      }
    };

    expect(actual_rule).toEqual(expected_rule);
  });
});
