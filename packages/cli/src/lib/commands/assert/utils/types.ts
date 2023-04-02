/* eslint-disable */
/**
 * @license Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

type StrictOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;


export type AssertionAggregationMethod =
  | 'median'
  | 'optimistic'
  | 'pessimistic'
  | 'median-run';

export type AssertionFailureLevel = 'off' | 'warn' | 'error';

export interface AssertionOptions {
  aggregationMethod?: AssertionAggregationMethod;
  minScore?: number;
  maxLength?: number;
  maxNumericValue?: number;
}

export interface Assertions {
  [auditId: string]: AssertionFailureLevel | [AssertionFailureLevel, AssertionOptions];
}

export interface BaseOptions {
  matchingUrlPattern?: string;
  aggregationMethod?: AssertionAggregationMethod;
  preset?: 'lighthouse:all' | 'lighthouse:recommended';
  assertions?: Assertions;
}

export interface Options extends BaseOptions {
  includePassedAssertions?: boolean;
  budgetsFile?: string;
  assertMatrix?: BaseOptions[];
}


export type AssertionType =
  | keyof StrictOmit<AssertionOptions, 'aggregationMethod'>
  | 'auditRan';

export interface AssertionResult {
  url: string;
  name: keyof Omit<AssertionOptions, 'aggregationMethod'> | 'auditRan';
  operator: string;
  expected: number;
  actual: number;
  values: number[];
  passed: boolean;
  level?: AssertionFailureLevel | {};
  auditId?: string;
  auditProperty?: string;
  auditTitle?: string;
  auditDocumentationLink?: string;
  message?: string;
}

export type AssertionResultNoURL = StrictOmit<AssertionResult, 'url'>;
