import jStat from 'jstat';
import { mean } from 'simple-statistics';
import type { TestResult } from '../types';
import { interpretD } from './effectSize';
import { sampleVariance, StatError, summarize } from './utils';

/** 1標本t検定（両側）。基準値 mu0 との平均の差を検定する */
export function tTestOneSample(x: number[], mu0: number): TestResult {
  const n = x.length;
  if (n < 2) {
    throw new StatError('2つ以上のデータが必要です。');
  }
  const v = sampleVariance(x);
  if (v === 0) {
    throw new StatError('すべての値が同一のため、t値を計算できません。');
  }
  const se = Math.sqrt(v / n);
  const t = (mean(x) - mu0) / se;
  const df = n - 1;
  const p = 2 * (1 - jStat.studentt.cdf(Math.abs(t), df));

  return {
    testId: 't-test-one-sample',
    method: '1標本t検定（両側）',
    statLabel: 't値',
    statValue: t,
    df: String(df),
    pValue: p,
    effectSizes: [
      {
        label: "Cohen's d",
        value: (mean(x) - mu0) / Math.sqrt(v),
        interpretation: interpretD((mean(x) - mu0) / Math.sqrt(v)),
      },
    ],
    summaries: summarize([x], ['データ']),
    extraStats: [
      { label: '基準値 μ₀', value: String(mu0) },
      { label: '平均 − 基準値', value: (mean(x) - mu0).toFixed(4) },
      { label: '標準誤差', value: se.toFixed(4) },
    ],
  };
}
