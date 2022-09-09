/* Compile configuration thresholds into rules.

Step 1:
  Flatten the blood_glucose_thresholds_mmoll object into a list of conditions
  and an 'other' object for each of high/low/normal:

Examples:

   { "BEFORE-BREAKFAST": { "high": 5.3, "low": 4.0 },
     "AFTER-DINNER": {"high": 7.8, "low": 4.0},
      "OTHER": {"high": 7.8, "low": 4.0} }
   --> (for 'low')
   other = { greaterThanInclusive: 0, lessThan: 4.0, exclude: [] }
   thresholds = []

   Note that BEFORE-BREAKFAST, AFTER-DINNER would have the same range as 'OTHER' so are omitted.

   { "BEFORE-BREAKFAST": { "high": 5.3, "low": 4.0 },
     "AFTER-DINNER": {"high": 7.8, "low": 4.0},
      "OTHER": {"high": 7.8, "low": 4.0} }
   --> (for 'normal')
   other = { greaterThanInclusive: 4.0, lessThan: 7.8, exclude: ["PRANDIAL-TAG-BEFORE-BREAKFAST"] }
   thresholds = [
       { greaterThanInclusive: 4.0, lessThan: 5.3, include: ["PRANDIAL-TAG-BEFORE-BREAKFAST"] }
   ]

   N.B. AFTER-DINNER is excluded because it is the same as 'OTHER'

   { "BEFORE-BREAKFAST": { "high": 5.3, "low": 4.0 },
     "AFTER-DINNER": {"high": 7.8, "low": 4.0},
      "OTHER": {"high": 7.8, "low": 4.0} }
   --> (for 'high')
   other = { greaterThanInclusive: 7.8, lessThan: null, exclude: ["PRANDIAL-TAG-BEFORE-BREAKFAST"] }
   thresholds = [
       { greaterThanInclusive: 5.3, lessThan: null, include: ["PRANDIAL-TAG-BEFORE-BREAKFAST"] }
   ]

   Again 'AFTER-DINNER' is ignored as it is the same as 'OTHER'.

Step 2:
   Convert other and thresholds into rules for the rules engine.
 */
import type {NestedCondition, RuleProperties, TopLevelCondition} from "json-rules-engine";
import {BloodGlucoseThreshold, HighLow, PartPrandialTag, SimpleOperator, ArrayOperator} from "./interfaces";

interface RangeLimits {
  greaterThanInclusive: number | null;
  lessThan: number | null;
}

interface TaggedRange extends RangeLimits {
  include: string[];
  exclude?: undefined;
}

interface OtherRange extends RangeLimits {
  include?: undefined;
  exclude: string[];
}

type ThresholdRange = TaggedRange | OtherRange;

const prandialTags: readonly PartPrandialTag[] = [
    'BEFORE-BREAKFAST',
   'AFTER-BREAKFAST',
   'BEFORE-LUNCH',
   'AFTER-LUNCH',
   'BEFORE-DINNER',
   'AFTER-DINNER'];

/* test whether the limits for a specific prandial tag as entirely contained inside the
   range given for 'other'. If so we won't need to exclude this tag from 'other'.
 */
function _containedInside(ge: number | null, lt: number | null, other: OtherRange): boolean {
  if (other.greaterThanInclusive !== null && (ge === null || ge > other.greaterThanInclusive)) {
    return false;
  }

  return !(other.lessThan != null && (lt === null || lt < other.lessThan));

}

/* Create a list of TaggedRange object with duplicated ranges coalesced into 'other' or into a single TaggedRange
 */
function flattenThresholds(config: BloodGlucoseThreshold, other: OtherRange, extractGE: (arg0: HighLow) => number | null, extractLT:  (arg0: HighLow) => number | null): TaggedRange[] {
  const thresholds: TaggedRange[] = [];

  Object.assign(other, {
    greaterThanInclusive: extractGE(config.OTHER),
    lessThan: extractLT(config.OTHER),
    exclude: []
  });

  for (const tag of prandialTags) {
    if (tag in config) {
      const range: HighLow = config[tag] as HighLow;
      const ge = extractGE(range);
      const lt = extractLT(range);

      if (ge !== other.greaterThanInclusive || lt !== other.lessThan) {
        const prandialTag = `PRANDIAL-TAG-${tag}`;

        // It the limits exactly match another threshold then coalesce them.
        let found = false;
        for (let i = 0; i < thresholds.length; i++) {
          if (thresholds[i].greaterThanInclusive === ge && thresholds[i].lessThan === lt) {
            thresholds[i].include.push(prandialTag);
            found = true;
            break;
          }
        }
        // No matching limits so add a new one.
        if (!found) {
          thresholds.push({ greaterThanInclusive: ge, lessThan: lt, include: [prandialTag] });
        }
        // Need to exclude from `other` unless other's limits lie inside ours (so a match on 'other' is harmless.
        if (!_containedInside(ge, lt, other)) {
          other.exclude.push(prandialTag);
        }
      }
    }
  }
  return thresholds;
}

function flattenThresholdsLow(config: BloodGlucoseThreshold, other: OtherRange): TaggedRange[] {
  return flattenThresholds(config, other, () => 0, limits => limits.low);
}

function flattenThresholdsNormal(config: BloodGlucoseThreshold, other: OtherRange): TaggedRange[] {
  return flattenThresholds(config, other, limits => limits.low, limits => limits.high);
}

function flattenThresholdsHigh(config: BloodGlucoseThreshold, other: OtherRange): TaggedRange[] {
  return flattenThresholds(config, other, limits => limits.high, () => null);
}

/* Given a RulesEngineCondition[] return a single condition that will require all of them to
* be true. This could be the original condition if there was only one, or a new `all` condition.
*/
function _all(conditions: NestedCondition[]): NestedCondition {
  if (conditions.length === 1) {
    return conditions[0];
  }
  return { all: conditions };
}

/* Given a RulesEngineCondition[] return a single condition that will require any of them to
* be true. This could be the original condition if there was only one, or a new `any` condition.
*/
function _toplevel(conditions: NestedCondition[]): TopLevelCondition {
  // At root level we must have 'any' or 'all' even if there is only one sub-condition
  if (conditions.length === 1 && 'all' in conditions[0]) {
      return conditions[0];
  }
  return { any: conditions };
}

/*
   Add a condition to the current list of conditions that will match on any of the prandial tags
   in 'include', or will exclude all of the prandial tags in 'exclude'.
   If the include/exclude attribute
   is missing, or doesn't contain any tags no condition is added.
 */
function _includeExclude(
    conditions: NestedCondition[],
    threshold: ThresholdRange,
    field: "include" | "exclude",
    singleOp: SimpleOperator,
    multiOp: ArrayOperator): void
{
  const value = threshold[field];
  if (value !== undefined) {
    switch (value.length) {
      case 0: break;
      case 1:
        conditions.push({
          fact: 'prandialTagId',
          operator: singleOp,
          value: value[0]
        });
        break;
      default:
        conditions.push({
          fact: 'prandialTagId',
          operator: multiOp,
          value: value
        });
    }
  }
}

/*
   Add a comparison condition for the upper or lower bound (if it is set to something not null)
 */
function _comparison(
    conditions: NestedCondition[],
    threshold: ThresholdRange,
    field: "greaterThanInclusive" | "lessThan"): void
{
  const value = threshold[field];
  if (value !== null) {
    conditions.push({
      fact: 'bloodGlucoseValue',
      operator: field,
      value: value
    });
  }
}

/*
    Convert a range into a single RulesEngineCondition that can match upper and lower bounds
    and include or exclude specific tags.
 */
function match(threshold: ThresholdRange): NestedCondition {
  const conditions: NestedCondition[] = [];
  _comparison(conditions, threshold, 'greaterThanInclusive');
  _comparison(conditions, threshold, 'lessThan');
  _includeExclude(conditions, threshold, 'include', 'equal', 'in');
  _includeExclude(conditions, threshold, 'exclude', 'notEqual', 'notIn');
  return _all(conditions);
}

/*
   Builds a complete rule for the rules engine that will match all the conditions for a given banding level.
 */
function flatThresholdsToBgRule(other: OtherRange, thresholds: TaggedRange[], level: string): RuleProperties {
  const conditions: NestedCondition[] = [
      ...thresholds.map(t => match(t)),
      match(other)
  ];

  return {
    conditions: _toplevel(conditions),
    event: {
      type: 'bloodGlucoseReadingBanding',
      params: {
        level: level
      }
    }
  };
}

/*
   Returns an array with one rule for each banding level.
 */
function compileThresholdsToRules(thresholds: BloodGlucoseThreshold): RuleProperties[] {
  const lowOther: OtherRange = {exclude: [], greaterThanInclusive: null, lessThan: null};
  const normalOther: OtherRange = {exclude: [], greaterThanInclusive: null, lessThan: null};
  const highOther: OtherRange = {exclude: [], greaterThanInclusive: null, lessThan: null};

  return [
    flatThresholdsToBgRule(lowOther, flattenThresholdsLow(thresholds, lowOther), "BG-READING-BANDING-LOW"),
    flatThresholdsToBgRule(normalOther, flattenThresholdsNormal(thresholds, normalOther), "BG-READING-BANDING-NORMAL"),
    flatThresholdsToBgRule(highOther, flattenThresholdsHigh(thresholds, highOther), "BG-READING-BANDING-HIGH"),
  ];
}

export { compileThresholdsToRules, flattenThresholds, flattenThresholdsLow, flattenThresholdsNormal, flattenThresholdsHigh, flatThresholdsToBgRule };
