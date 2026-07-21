import jStat from 'jstat';
import type { TestResult } from '../types';
import { sampleVariance, StatError, summarize } from './utils';

/** 等分散性のF検定（両側） */
export function fTestVariance(a: number[], b: number[]): TestResult {
  if (a.length < 2 || b.length < 2) {
    throw new StatError('各群に2つ以上のデータが必要です。');
  }
  const v1 = sampleVariance(a);
  const v2 = sampleVariance(b);
  if (v2 === 0 || v1 === 0) {
    throw new StatError('分散が0の群があるため、F値を計算できません。');
  }
  const f = v1 / v2;
  const df1 = a.length - 1;
  const df2 = b.length - 1;
  const cdf = jStat.centralF.cdf(f, df1, df2);
  const p = Math.min(1, 2 * Math.min(cdf, 1 - cdf));

  return {
    testId: 'f-test-variance',
    method: '等分散性のF検定（両側）',
    statLabel: 'F値（s₁²/s₂²）',
    statValue: f,
    df: `${df1}, ${df2}`,
    pValue: p,
    summaries: summarize([a, b], ['群A', '群B']),
    extraStats: [
      { label: '群Aの不偏分散', value: v1.toFixed(4) },
      { label: '群Bの不偏分散', value: v2.toFixed(4) },
    ],
  };
}
