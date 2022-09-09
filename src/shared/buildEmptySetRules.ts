import type {NestedCondition, RuleProperties} from "json-rules-engine";

function buildEmptySetRules(conditions: string[]): RuleProperties[] {
  const conditionList: NestedCondition[] = conditions.map((condition: string): NestedCondition => ({
      fact: condition,
      operator: 'equal',
      value: 'undefined'
    }));

  const rules: RuleProperties[] = [
    {
      conditions: {
        all: conditionList
      },
      event: {
        type: 'applyEmptySet'
      },
      priority: 1
    }
  ];

  return rules;
}

export default buildEmptySetRules;
