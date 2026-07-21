import jStat from 'jstat';
import { mean } from 'simple-statistics';
import type { TestResult } from '../types';
import { interpretD } from './effectSize';
import { sampleVariance, StatError, summarize } from './utils';

/** 対応あり2標本t検定（両側） */
export function tTestPaired(a: number[], b: number[]): TestResult {
  if (a.length !== b.length) {
    throw new StatError('2つの条件のデータ数が一致していません。');
  }
  const n = a.length;
  if (n < 2) {
    throw new StatError('2ペア以上のデータが必要です。');
  }
  const diffs = a.map((v, i) => v - b[i]);
  const dMean = mean(diffs);
  const dVar = sampleVariance(diffs);
  if (dVar === 0) {
    throw new StatError('すべてのペアの差が同一のため、t値を計算できません。');
  }
  const se = Math.sqrt(dVar / n);
  const t = dMean / se;
  const df = n - 1;
  const p = 2 * (1 - jStat.studentt.cdf(Math.abs(t), df));

  return {
    testId: 't-test-paired',
    method: '対応あり2標本t検定（両側）',
    statLabel: 't値',
    statValue: t,
    df: String(df),
    pValue: p,
    effectSizes: [
      {
        label: "Cohen's d（dz：差の平均÷差のSD）",
        value: dMean / Math.sqrt(dVar),
        interpretation: interpretD(dMean / Math.sqrt(dVar)),
      },
    ],
    summaries: summarize([a, b], ['条件A', '条件B']),
    extraStats: [
      { label: '差の平均（条件A − 条件B）', value: dMean.toFixed(4) },
      { label: '差の標準誤差', value: se.toFixed(4) },
    ],
  };
}
