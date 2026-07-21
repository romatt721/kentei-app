import jStat from 'jstat';
import { mean } from 'simple-statistics';
import type { TestResult } from '../types';
import { interpretD } from './effectSize';
import { sampleVariance, StatError, summarize } from './utils';

/** ウェルチのt検定（等分散を仮定しない2標本t検定・両側） */
export function welchTTest(a: number[], b: number[]): TestResult {
  if (a.length < 2 || b.length < 2) {
    throw new StatError('各群に2つ以上のデータが必要です。');
  }
  const n1 = a.length;
  const n2 = b.length;
  const v1 = sampleVariance(a);
  const v2 = sampleVariance(b);
  const se2 = v1 / n1 + v2 / n2;
  if (se2 === 0) {
    throw new StatError('すべての値が同一のため、t値を計算できません。');
  }
  const t = (mean(a) - mean(b)) / Math.sqrt(se2);
  // ウェルチ＝サタスウェイトの自由度
  const df =
    se2 ** 2 /
    ((v1 / n1) ** 2 / (n1 - 1) + (v2 / n2) ** 2 / (n2 - 1));
  const p = 2 * (1 - jStat.studentt.cdf(Math.abs(t), df));

  return {
    testId: 'welch-t-test',
    method: 'ウェルチのt検定（等分散を仮定しない・両側）',
    statLabel: 't値',
    statValue: t,
    df: df.toFixed(2),
    pValue: p,
    effectSizes: [
      {
        label: "Cohen's d（両群の分散の平均で標準化）",
        value: (mean(a) - mean(b)) / Math.sqrt((v1 + v2) / 2),
        interpretation: interpretD((mean(a) - mean(b)) / Math.sqrt((v1 + v2) / 2)),
      },
    ],
    summaries: summarize([a, b], ['群A', '群B']),
    extraStats: [
      { label: '平均値の差（群A − 群B）', value: (mean(a) - mean(b)).toFixed(4) },
      { label: '標準誤差', value: Math.sqrt(se2).toFixed(4) },
    ],
  };
}
