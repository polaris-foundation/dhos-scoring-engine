/*
 * This ruleset implements NEWS2 scoring for nurse concern.
 *
 * Note that this is not included in the RCP's NEWS2 definition; it is defined
 * by us. It does not affect the NEWS2 score, but the event triggered by this
 * rule is used to change the displayed score (e.g. 1 -> 1C).
 */
import type {RuleProperties} from "json-rules-engine";

const rules: RuleProperties[] = [
  {
    conditions: {
      any: [
        {
          fact: 'nurseConcern',
          operator: 'notEqual',
          value: 'undefined'
        }
      ]
    },
    event: {
      type: 'applyNurseConcern'
    },
    priority: 100
  }
];

export default rules;
