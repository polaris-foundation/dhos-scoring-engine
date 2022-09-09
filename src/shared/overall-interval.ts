/*
 * This ruleset calculates the time interval to be used to decide when the next set
 * of observations is due to be measured.
 */
import type {RuleProperties} from "json-rules-engine";

const rules: RuleProperties[] = [
  {
    conditions: {
      all: [
        {
          fact: 'overallSeverity',
          operator: 'equal',
          value: 'low'
        },
        {
          fact: 'overallScore',
          operator: 'equal',
          value: 0
        }
      ]
    },
    event: {
      type: 'applyZeroSeverityInterval'
    },
    priority: 1
  },
  {
    conditions: {
      all: [
        {
          fact: 'overallSeverity',
          operator: 'equal',
          value: 'low'
        },
        {
          fact: 'overallScore',
          operator: 'greaterThan',
          value: 0
        }
      ]
    },
    event: {
      type: 'applyLowSeverityInterval'
    },
    priority: 1
  },
  {
    conditions: {
      all: [
        {
          fact: 'overallSeverity',
          operator: 'equal',
          value: 'low-medium'
        }
      ]
    },
    event: {
      type: 'applyLowMediumSeverityInterval'
    },
    priority: 1
  },
  {
    conditions: {
      all: [
        {
          fact: 'overallSeverity',
          operator: 'equal',
          value: 'medium'
        }
      ]
    },
    event: {
      type: 'applyMediumSeverityInterval'
    },
    priority: 1
  },
  {
    conditions: {
      all: [
        {
          fact: 'overallSeverity',
          operator: 'equal',
          value: 'high'
        }
      ]
    },
    event: {
      type: 'applyHighSeverityInterval'
    },
    priority: 1
  }
];

export default rules;
