import jStat from 'jstat';
import type { TestResult } from '../types';
import { interpretR } from './effectSize';
import { StatError } from './utils';

/**
 * カイ二乗適合度検定
 * @param observed 各カテゴリの観測度数
 * @param ratios 各カテゴリの期待比率（合計1でなくてよい。内部で正規化する）
 */
export function chiSquareGoodness(observed: number[], ratios: number[]): TestResult {
  const k = observed.length;
  if (k < 2) {
    throw new StatError('2カテゴリ以上が必要です。');
  }
  for (const v of observed) {
    if (!Number.isInteger(v) || v < 0) {
      throw new StatError('観測度数には0以上の整数を入力してください。');
    }
  }
  for (const r of ratios) {
    if (!(r > 0)) {
      throw new StatError('期待比率には0より大きい数値を入力してください。');
    }
  }
  const total = observed.reduce((s, v) => s + v, 0);
  if (total === 0) {
    throw new StatError('観測度数の合計が0です。');
  }
  const ratioSum = ratios.reduce((s, v) => s + v, 0);
  const expected = ratios.map((r) => (total * r) / ratioSum);

  let chi2 = 0;
  let smallExpectedCount = 0;
  let minExpected = Infinity;
  expected.forEach((e, i) => {
    chi2 += (observed[i] - e) ** 2 / e;
    minExpected = Math.min(minExpected, e);
    if (e < 5) smallExpectedCount++;
  });
  const df = k - 1;
  const p = 1 - jStat.chisquare.cdf(chi2, df);

  const warnings: string[] = [];
  if (smallExpectedCount > 0) {
    warnings.push(
      `期待度数が5未満のカテゴリが${smallExpectedCount}個あります。χ²近似の精度が下がります。`,
    );
  }

  return {
    testId: 'chi-square-goodness',
    method: 'カイ二乗適合度検定',
    statLabel: 'χ²値',
    statValue: chi2,
    df: String(df),
    pValue: p,
    effectSizes: [
      {
        label: "Cohen's w（√(χ²/N)）",
        value: Math.sqrt(chi2 / total),
        interpretation: interpretR(Math.sqrt(chi2 / total)),
      },
    ],
    warnings,
    extraStats: [
      { label: '総度数 N', value: String(total) },
      { label: '最小期待度数', value: minExpected.toFixed(2) },
      ...expected.map((e, i) => ({
        label: `カテゴリ${i + 1}の期待度数`,
        value: e.toFixed(2),
      })),
    ],
  };
}
