/*
 * This ruleset determines which monitoring instructions are given to the SEND user,
 * based on the NEWS2 severity/score of the obs set.
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
      type: 'applyZeroMonitoringInstruction'
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
      type: 'applyLowMonitoringInstruction'
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
      type: 'applyLowMediumMonitoringInstruction'
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
      type: 'applyMediumMonitoringInstruction'
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
      type: 'applyHighMonitoringInstruction'
    },
    priority: 1
  }
];

export default rules;
