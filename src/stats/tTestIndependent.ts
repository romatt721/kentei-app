import jStat from 'jstat';
import { mean } from 'simple-statistics';
import type { TestResult } from '../types';
import { interpretD } from './effectSize';
import { sampleVariance, StatError, summarize } from './utils';

/** 対応なし2標本t検定（スチューデントのt検定・等分散仮定・両側） */
export function tTestIndependent(a: number[], b: number[]): TestResult {
  if (a.length < 2 || b.length < 2) {
    throw new StatError('各群に2つ以上のデータが必要です。');
  }
  const n1 = a.length;
  const n2 = b.length;
  const v1 = sampleVariance(a);
  const v2 = sampleVariance(b);
  const pooled = ((n1 - 1) * v1 + (n2 - 1) * v2) / (n1 + n2 - 2);
  if (pooled === 0) {
    throw new StatError('すべての値が同一のため、t値を計算できません。');
  }
  const se = Math.sqrt(pooled * (1 / n1 + 1 / n2));
  const t = (mean(a) - mean(b)) / se;
  const df = n1 + n2 - 2;
  const p = 2 * (1 - jStat.studentt.cdf(Math.abs(t), df));
  const d = (mean(a) - mean(b)) / Math.sqrt(pooled);

  return {
    testId: 't-test-independent',
    method: '対応なし2標本t検定（スチューデントのt検定・両側）',
    statLabel: 't値',
    statValue: t,
    df: String(df),
    pValue: p,
    effectSizes: [
      { label: "Cohen's d", value: d, interpretation: interpretD(d) },
    ],
    summaries: summarize([a, b], ['群A', '群B']),
    extraStats: [
      { label: '平均値の差（群A − 群B）', value: (mean(a) - mean(b)).toFixed(4) },
      { label: '標準誤差', value: se.toFixed(4) },
    ],
  };
}
