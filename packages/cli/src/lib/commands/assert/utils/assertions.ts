/**
 * @license Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

'use strict';

import {
  AssertionAggregationMethod,
  AssertionFailureLevel,
  AssertionOptions,
  AssertionResult,
  AssertionResultNoURL,
  AssertionType,
  BaseOptions,
  Options
} from './types';

import { Result as AuditResult } from 'lighthouse/types/lhr/audit-result';
import { AllPreset as preset } from '../presets/all';
import { default as Result } from 'lighthouse/types/lhr/lhr';
import { splitMarkdownLink } from './markdown';
import { computeRepresentativeRuns } from './representative-runs';
import { Budget, BudgetDetails } from './budgets/types';


const AUDIT_TYPE_VALUE_GETTERS: Record<AssertionType, (result: AuditResult) => number | undefined> = {
  auditRan: (result?: AuditResult) => (result === undefined ? 0 : 1),
  minScore: (result?: AuditResult) => {
    if (typeof result?.score === 'number') return result.score;
    if (result?.scoreDisplayMode === 'notApplicable') return 1;
    if (result?.scoreDisplayMode === 'informative') return 0;
    return undefined;
  },
  maxLength: (result?: AuditResult) => {
    const details = result?.details as { items: any[] };
    if (details && details?.items) {
      details.items.length;
    }
    return 0;
  },
  maxNumericValue: result => result.numericValue
};

const AUDIT_TYPE_OPERATORS: Record<AssertionType, { operator: string, passedFn(actual: number, expected: number): boolean }> = {
  auditRan: { operator: '==', passedFn: (actual, expected) => actual === expected },
  minScore: { operator: '>=', passedFn: (actual, expected) => actual >= expected },
  maxLength: { operator: '<=', passedFn: (actual, expected) => actual <= expected },
  maxNumericValue: { operator: '<=', passedFn: (actual, expected) => actual <= expected }
};

const isFiniteNumber = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x);

function normalizeAssertion(assertion: AssertionFailureLevel | [AssertionFailureLevel, AssertionOptions] | undefined) {
  if (!assertion) return ['off', {}];
  if (typeof assertion === 'string') return [assertion, {}];
  return assertion;
}

function getValueForAggregationMethod(values: number[], aggregationMethod: AssertionAggregationMethod, assertionType: AssertionType) {
  if (aggregationMethod === 'median') {
    const medianIndex = Math.floor((values.length - 1) / 2);
    const sorted = values.slice().sort((a, b) => a - b);
    if (values.length % 2 === 1) return sorted[medianIndex];
    return (sorted[medianIndex] + sorted[medianIndex + 1]) / 2;
  }

  const useMin =
    (aggregationMethod === 'optimistic' && assertionType.startsWith('max')) ||
    (aggregationMethod === 'pessimistic' && assertionType.startsWith('min'));
  return useMin ? Math.min(...values) : Math.max(...values);
}

function getAssertionResult(auditResults: AuditResult[], aggregationMethod: AssertionAggregationMethod, assertionType: AssertionType, expectedValue: number) {
  const values = auditResults.map(AUDIT_TYPE_VALUE_GETTERS[assertionType]);
  const filteredValues = values.filter(isFiniteNumber);
  const { operator, passedFn } = AUDIT_TYPE_OPERATORS[assertionType];

  if (
    (!filteredValues.length && aggregationMethod !== 'pessimistic') ||
    (filteredValues.length !== values.length && aggregationMethod === 'pessimistic')
  ) {

    let message: string | undefined;
    if (values.some(v => v === undefined)) {
      const userAction = `"${assertionType.toString()}" might not be a valid assertion for this audit.`;
      message = `Audit did not produce a value at all. ${userAction}`;
    } else {
      const userAction =
        aggregationMethod === 'pessimistic'
          ? 'Try using an aggregationMethod other than "pessimistic".'
          : 'If this is reproducible, please file an issue on GitHub.';
      message = `Audit failed to produce a valid value. ${userAction}`;
    }

    const didRun = values.map(value => (isFiniteNumber(value) ? value : NaN));

    return [
      {
        name: assertionType,
        expected: expectedValue,
        actual: NaN,
        values: didRun,
        operator,
        passed: false,
        message
      }
    ];
  }

  const actualValue = getValueForAggregationMethod(
    filteredValues,
    aggregationMethod,
    assertionType
  );

  return [
    {
      name: assertionType,
      expected: expectedValue,
      actual: actualValue,
      values: filteredValues,
      operator,
      passed: passedFn(actualValue, expectedValue)
    }
  ];
}

function getStandardAssertionResults(possibleAuditResults: (AuditResult | undefined)[], options: AssertionOptions, auditId?: string) {
  const { minScore, maxLength, maxNumericValue, aggregationMethod = 'optimistic' } = options;
  if (possibleAuditResults.some(result => result === undefined)) {
    return [
      {
        name: 'auditRan',
        expected: 1,
        actual: 0,
        values: possibleAuditResults.map(result => (result === undefined ? 0 : 1)),
        operator: '>=',
        passed: false,
        message:
          auditId && !(auditId in preset.assertions)
            ? `"${auditId}" is not a known audit.`
            : undefined
      }
    ];
  }

  const auditResults = possibleAuditResults as AuditResult[];

  const results: AssertionResultNoURL[] = [];

  // Keep track of if we had a manual assertion so we know whether or not to automatically create a
  // default minScore assertion.
  let hadManualAssertion = false;

  if (maxLength !== undefined) {
    hadManualAssertion = true;
    results.push(...getAssertionResult(auditResults, aggregationMethod, 'maxLength', maxLength));
  }

  if (maxNumericValue !== undefined) {
    hadManualAssertion = true;
    results.push(
      ...getAssertionResult(auditResults, aggregationMethod, 'maxNumericValue', maxNumericValue)
    );
  }

  const realMinScore = minScore === undefined && !hadManualAssertion ? 0.9 : minScore;
  if (realMinScore !== undefined) {
    results.push(...getAssertionResult(auditResults, aggregationMethod, 'minScore', realMinScore));
  }

  return results;
}

function getAssertionResultsForBudgetRow(key: string, actual: number, expected: number) {
  return getAssertionResult(
    [{ score: 0, numericValue: actual } as AuditResult],
    'pessimistic',
    'maxNumericValue',
    expected
  ).map(assertion => {
    return { ...assertion, auditProperty: key };
  });
}

/**
 * Budgets are somewhat unique in that they are already asserted at collection time by Lighthouse.
 * We won't use any of our fancy logic here and we just want to pass on whatever Lighthouse found
 * by creating fake individual audit results to assert against for each individual table row
 * (de-duped by "<resource type>.<property>").
 *
 */
function getBudgetAssertionResults(auditResults: AuditResult[]) {
  const results: AssertionResultNoURL[] = [];
  const resultsKeys = new Set();

  for (const auditResult of auditResults) {
    if (!auditResult) continue;
    const details = auditResult.details as any as BudgetDetails;
    if (!details || !details.items) continue;

    for (const budgetRow of details.items) {
      const sizeKey = `${budgetRow.resourceType}.size`;
      const countKey = `${budgetRow.resourceType}.count`;

      if (budgetRow.sizeOverBudget && !resultsKeys.has(sizeKey)) {
        const actual = budgetRow.size || budgetRow.transferSize;
        const expected = actual - budgetRow.sizeOverBudget;
        results.push(...getAssertionResultsForBudgetRow(sizeKey, actual, expected));
        resultsKeys.add(sizeKey);
      }

      if (budgetRow.countOverBudget && !resultsKeys.has(countKey)) {
        const actual = budgetRow.requestCount;
        const overBudgetMatch = budgetRow.countOverBudget.match(/\d+/);
        if (!overBudgetMatch) continue;
        const overBudget = Number(overBudgetMatch[0]) || 0;
        const expected = actual - overBudget;
        results.push(...getAssertionResultsForBudgetRow(countKey, actual, expected));
        resultsKeys.add(countKey);
      }
    }
  }

  return results;
}

/**
 * Gets the assertion results for a particular audit. This method delegates some of the unique
 * handling for budgets and auditProperty assertions as necessary.
 */
function getCategoryAssertionResults(auditProperty: string[], assertionOptions: AssertionOptions, lhrs: Result[]) {
  if (auditProperty.length !== 1) {
    throw new Error(`Invalid resource-summary assertion "${auditProperty.join('.')}"`);
  }

  const categoryId = auditProperty[0];

  const psuedoAudits = lhrs.map((lhr: Result) => {
    const category = lhr.categories[categoryId];
    if (!category) return undefined;

    return {
      score: category.score
    } as AuditResult;
  });

  return getStandardAssertionResults(psuedoAudits, assertionOptions).map(result => ({
    ...result,
    auditProperty: categoryId
  }));
}

function doesLHRMatchPattern(pattern: string, lhr: Result) {
  return new RegExp(pattern).test(lhr.finalUrl);
}

/**
 * Gets the assertion results for a particular audit. This method delegates some of the unique
 * handling for budgets and auditProperty assertions as necessary.
 */
function getAssertionResultsForAudit(auditId: string, auditProperty: undefined | string[], auditResults: AuditResult[], assertionOptions: AssertionOptions, lhrs: Result[]) {
  if (auditId === 'performance-budget') {
    return getBudgetAssertionResults(auditResults);
  } else if (auditId === 'categories' && auditProperty) {
    return getCategoryAssertionResults(auditProperty, assertionOptions, lhrs);
  } else if (auditId === 'resource-summary' && auditProperty) {
    if (auditProperty.length !== 2 || !['size', 'count'].includes(auditProperty[1])) {
      throw new Error(`Invalid resource-summary assertion "${auditProperty.join('.')}"`);
    }

    const psuedoAuditResults = auditResults.map(result => {
      const details = result.details as any as BudgetDetails;
      if (!result || !details || !details.items) return;
      const item = details.items.find(item => item.resourceType === auditProperty[0]);
      if (!item) return;

      const primaryItemKey = (auditProperty[1] === 'size' ? 'size' : 'requestCount');
      const backupItemKey = (auditProperty[1] === 'size' ? 'transferSize' : '');
      const itemKey = primaryItemKey in item ? primaryItemKey : backupItemKey;
      if (!(itemKey in item)) return;
      return { ...result, numericValue: item[itemKey as any as keyof Budget] as number };
    });

    return getStandardAssertionResults(psuedoAuditResults, assertionOptions).map(result => ({
      ...result,
      auditProperty: auditProperty.join('.')
    }));
  } else if (auditId === 'user-timings' && auditProperty) {
    const userTimingName = kebabCase(auditProperty.join('-'), { alphanumericOnly: true });
    const psuedoAuditResults = auditResults.map(result => {
      const details = result.details as { items: any[] };
      if (!result || !details || !details.items) return;
      const item = details.items.find(
        item => kebabCase(item.name, { alphanumericOnly: true }) === userTimingName
      );
      if (!item) return;
      const numericValue = Number.isFinite(item.duration) ? item.duration : item.startTime;
      return { ...result, numericValue };
    });

    return getStandardAssertionResults(psuedoAuditResults, assertionOptions).map(result => ({
      ...result,
      auditProperty: userTimingName
    }));
  } else {
    return getStandardAssertionResults(auditResults, assertionOptions, auditId);
  }
}

function resolveAssertionOptionsAndLhrs(baseOptions: BaseOptions, unfilteredLhrs: Result[]) {
  const { preset = '', ...optionOverrides } = baseOptions;
  let optionsToUse = optionOverrides;
  const presetMatch = preset.match(/lighthouse:(.*)$/);
  if (presetMatch) {
    const presetData = require(`./presets/${presetMatch[1]}.js`);
    optionsToUse = merge(structuredClone(presetData), optionsToUse);
  }

  const { assertions = {}, matchingUrlPattern: urlPattern, aggregationMethod } = optionsToUse;
  const lhrs = urlPattern
    ? unfilteredLhrs.filter(lhr => doesLHRMatchPattern(urlPattern, lhr))
    : unfilteredLhrs;

  // Double-check we've only got one URL to look at that should have been pre-grouped in `getAllAssertionResults`.
  const uniqueURLs = new Set(lhrs.map(lhr => lhr.finalUrl));
  if (uniqueURLs.size > 1) throw new Error('Can only assert one URL at a time!');

  const medianLhrs = computeRepresentativeRuns([
    lhrs.map(lhr => ([lhr, lhr]))
  ]);

  const auditsToAssert = [...new Set(Object.keys(assertions).map(key => kebabCase(key)))].map(
    assertionKey => {
      const [auditId, ...rest] = assertionKey.split(/\.|:/g).filter(Boolean);
      const auditInstances = lhrs.map(lhr => lhr.audits[auditId]).filter(Boolean);
      const failedAudit = auditInstances.find(audit => audit.score !== 1);
      const audit = failedAudit || auditInstances[0] || {};
      const auditTitle = audit.title;
      const auditLinks = splitMarkdownLink(audit.description || '')
        .map((segment) => (segment.isLink ? segment.linkHref : ''))
        .filter(Boolean);
      const auditDocumentationLinkMatches = auditLinks.filter(
        link => link && (link.includes('web.dev') || link.includes('developers.google.com/web'))
      );
      const auditDocumentationLink =
        auditDocumentationLinkMatches.find(link => link && link.includes('web.dev')) ||
        auditDocumentationLinkMatches[0] ||
        auditLinks[auditLinks.length - 1];
      if (!rest.length) return { assertionKey, auditId, auditTitle, auditDocumentationLink };
      return { assertionKey, auditId, auditTitle, auditDocumentationLink, auditProperty: rest };
    }
  );

  return {
    assertions,
    auditsToAssert,
    medianLhrs,
    aggregationMethod,
    lhrs: lhrs,
    url: (lhrs[0] && lhrs[0].finalUrl) || ''
  };
}

function getAllAssertionResultsForUrl(baseOptions: BaseOptions, unfilteredLhrs: Result[]) {
  const { assertions, auditsToAssert, medianLhrs, lhrs, url, aggregationMethod } =
    resolveAssertionOptionsAndLhrs(baseOptions, unfilteredLhrs);

  // If we don't have any data, just return early.
  if (!lhrs.length) return [];

  const results: AssertionResult[] = [];

  for (const auditToAssert of auditsToAssert) {
    const { assertionKey, auditId, auditProperty } = auditToAssert;
    const [level, assertionOptions] = normalizeAssertion(assertions[assertionKey]);
    if (level === 'off') continue;

    const options = { aggregationMethod, ...assertionOptions };
    const lhrsToUseForAudit = options.aggregationMethod === 'median-run' ? medianLhrs : lhrs;
    const auditResults = lhrsToUseForAudit.map(lhr => lhr.audits[auditId]);
    const assertionResults = getAssertionResultsForAudit(
      auditId,
      auditProperty,
      auditResults,
      options,
      lhrs
    );

    for (const result of assertionResults) {
      const finalResult: AssertionResult = { ...result, auditId, level, url } as AssertionResult;
      if (auditToAssert.auditTitle) finalResult.auditTitle = auditToAssert.auditTitle;
      if (auditToAssert.auditDocumentationLink) {
        finalResult.auditDocumentationLink = auditToAssert.auditDocumentationLink;
      }

      results.push(finalResult);
    }
  }

  return results;
}

/**
 * Computes all assertion results for the given LHR-set and options.
 */
export function getAllAssertionResults(options: Options, lhrs: Result[]) {
  const groupedByURL = groupBy(lhrs, (lhr: any) => lhr.finalUrl);

  let arrayOfOptions: BaseOptions[] = [options];
  if (options.assertMatrix) {
    if (options.assertions || options.preset || options.budgetsFile || options.aggregationMethod) {
      throw new Error('Cannot use assertMatrix with other options');
    }

    arrayOfOptions = options.assertMatrix;
  }

  const results: AssertionResult[] = [];
  for (const lhrSet of groupedByURL) {
    for (const baseOptions of arrayOfOptions) {
      results.push(...getAllAssertionResultsForUrl(baseOptions, lhrSet));
    }
  }

  if (options.includePassedAssertions) return results;
  return results.filter(result => !result.passed);
}

function groupBy<T>(items: T[], keyFn: (i: T) => keyof T) {
  return [...groupIntoMap(items, keyFn).values()];
}

function groupIntoMap<T>(items: T[], keyFn: (i: T) => keyof T) {
  const groups = new Map<keyof T, T[]>();

  for (const item of items) {
    const key = keyFn(item);
    const group = groups.get(key) || [];
    group.push(item);
    groups.set(key, group);
  }

  return groups;
}


/**
 * Recursively merges properties of v2 into v1. Mutates o1 in place, does not return a copy.
 */
function merge<T>(v1: T, v2: T) {
  if (Array.isArray(v1)) {
    if (!Array.isArray(v2)) return v2;

    for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
      v1[i] = i < v2.length ? merge(v1[i], v2[i]) : v1[i];
    }

    return v1;
  } else if (typeof v1 === 'object' && v1 !== null) {
    if (typeof v2 !== 'object' || v2 === null) return v2;
    const o1: Record<string, any> = v1;
    const o2: Record<string, any> = v2;

    const o1Keys = new Set(Object.keys(o1));
    const o2Keys = new Set(Object.keys(o2));
    for (const key of new Set([...o1Keys, ...o2Keys])) {
      o1[key] = key in o2 ? merge(o1[key], o2[key]) : o1[key];
    }

    return v1;
  } else {
    return v2;
  }
}

/**
 * Converts a string from camelCase to kebab-case.
 */
function kebabCase(s: string, opts?: {alphanumericOnly?: boolean}) {
  let kebabed = s.replace(/([a-z])([A-Z])/g, '$1-$2');
  if (opts && opts.alphanumericOnly) {
    kebabed = kebabed
      .replace(/[^a-z0-9]+/gi, '-')
      .replace(/-+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  return kebabed.toLowerCase();
}
