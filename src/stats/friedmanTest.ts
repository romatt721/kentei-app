import jStat from 'jstat';
import type { TestResult } from '../types';
import { interpretW } from './effectSize';
import { rankWithTies, StatError, summarize, tieCorrectionSum } from './utils';

/** フリードマン検定（χ²近似・同順位補正） */
export function friedmanTest(conds: number[][]): TestResult {
  const k = conds.length;
  if (k < 2) {
    throw new StatError('2条件以上のデータが必要です。');
  }
  const n = conds[0].length;
  if (n < 2) {
    throw new StatError('2人以上の対象が必要です。');
  }
  if (conds.some((c) => c.length !== n)) {
    throw new StatError('すべての条件のデータ数が一致していません。');
  }

  // 対象（行）ごとに条件間で順位づけ
  const rankSums = new Array<number>(k).fill(0);
  let tieSum = 0; // Σ(t³ - t) 全行の合計
  for (let i = 0; i < n; i++) {
    const row = conds.map((c) => c[i]);
    const ranks = rankWithTies(row);
    ranks.forEach((r, j) => {
      rankSums[j] += r;
    });
    tieSum += tieCorrectionSum(row);
  }

  let chi2 =
    (12 / (n * k * (k + 1))) * rankSums.reduce((s, r) => s + r * r, 0) -
    3 * n * (k + 1);
  // 同順位補正
  const c = 1 - tieSum / (n * k * (k * k - 1));
  if (c <= 0) {
    throw new StatError('すべての対象で全条件の値が同一のため、検定を実行できません。');
  }
  chi2 = chi2 / c;

  const df = k - 1;
  const p = 1 - jStat.chisquare.cdf(chi2, df);

  const labels = conds.map((_, j) => `条件${j + 1}`);
  return {
    testId: 'friedman-test',
    method: 'フリードマン検定',
    statLabel: 'χ²値',
    statValue: chi2,
    df: String(df),
    pValue: p,
    effectSizes: [
      {
        label: 'ケンドールの一致係数 W（χ²/(n(k−1))）',
        value: Math.min(1, Math.max(0, chi2 / (n * (k - 1)))),
        interpretation: interpretW(Math.min(1, Math.max(0, chi2 / (n * (k - 1))))),
      },
    ],
    approxNote:
      'p値はχ²近似（同順位補正あり）による値です。対象数が10未満の場合は近似精度が下がります。',
    summaries: summarize(conds, labels),
    extraStats: labels.map((label, j) => ({
      label: `${label}の順位和`,
      value: rankSums[j].toFixed(1),
    })),
  };
}
