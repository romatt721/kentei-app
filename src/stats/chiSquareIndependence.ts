import jStat from 'jstat';
import type { TestResult } from '../types';
import { interpretR } from './effectSize';
import { StatError } from './utils';

/** カイ二乗独立性検定（イェーツ補正なし） */
export function chiSquareIndependence(observed: number[][]): TestResult {
  const rows = observed.length;
  const cols = observed[0]?.length ?? 0;
  if (rows < 2 || cols < 2) {
    throw new StatError('2×2以上の分割表が必要です。');
  }
  for (const row of observed) {
    for (const v of row) {
      if (!Number.isInteger(v) || v < 0) {
        throw new StatError('度数には0以上の整数を入力してください。');
      }
    }
  }
  const rowSums = observed.map((row) => row.reduce((s, v) => s + v, 0));
  const colSums = Array.from({ length: cols }, (_, j) =>
    observed.reduce((s, row) => s + row[j], 0),
  );
  const total = rowSums.reduce((s, v) => s + v, 0);
  if (rowSums.some((s) => s === 0) || colSums.some((s) => s === 0)) {
    throw new StatError(
      '合計が0の行または列があります。すべての行・列に1以上の度数が必要です。',
    );
  }

  let chi2 = 0;
  let minExpected = Infinity;
  let smallExpectedCount = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const expected = (rowSums[i] * colSums[j]) / total;
      chi2 += (observed[i][j] - expected) ** 2 / expected;
      minExpected = Math.min(minExpected, expected);
      if (expected < 5) smallExpectedCount++;
    }
  }
  const df = (rows - 1) * (cols - 1);
  const p = 1 - jStat.chisquare.cdf(chi2, df);

  const warnings: string[] = [];
  if (smallExpectedCount > 0) {
    warnings.push(
      `期待度数が5未満のセルが${smallExpectedCount}個あります。χ²近似の精度が下がるため、2×2の場合はフィッシャーの正確確率検定の使用を検討してください。`,
    );
  }

  return {
    testId: 'chi-square-independence',
    method: 'カイ二乗独立性検定（イェーツ補正なし）',
    statLabel: 'χ²値',
    statValue: chi2,
    df: String(df),
    pValue: p,
    effectSizes: [
      {
        label: "Cramér's V",
        value: Math.sqrt(chi2 / (total * Math.min(rows - 1, cols - 1))),
        interpretation: interpretR(
          Math.sqrt(chi2 / (total * Math.min(rows - 1, cols - 1))),
        ),
      },
    ],
    warnings,
    extraStats: [
      { label: '総度数 N', value: String(total) },
      { label: '最小期待度数', value: minExpected.toFixed(2) },
    ],
  };
}
