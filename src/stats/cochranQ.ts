import jStat from 'jstat';
import type { TestResult } from '../types';
import { StatError } from './utils';

/**
 * コクランのQ検定（対応のある3条件以上の2値データ）
 * @param conds 条件ごとの0/1データ列（conds[条件][対象]）
 */
export function cochranQ(conds: number[][]): TestResult {
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
  for (const c of conds) {
    for (const v of c) {
      if (v !== 0 && v !== 1) {
        throw new StatError('データは0（失敗・なし）または1（成功・あり）で入力してください。');
      }
    }
  }

  const colSums = conds.map((c) => c.reduce((s, v) => s + v, 0)); // 条件ごとの合計
  const rowSums = Array.from({ length: n }, (_, i) =>
    conds.reduce((s, c) => s + c[i], 0),
  ); // 対象ごとの合計
  const total = colSums.reduce((s, v) => s + v, 0);

  const denominator = k * total - rowSums.reduce((s, r) => s + r * r, 0);
  if (denominator === 0) {
    throw new StatError(
      'すべての対象が全条件で同じ値（全て0または全て1）のため、検定を実行できません。',
    );
  }
  const q =
    ((k - 1) * (k * colSums.reduce((s, v) => s + v * v, 0) - total * total)) /
    denominator;

  const df = k - 1;
  const p = 1 - jStat.chisquare.cdf(q, df);

  const labels = conds.map((_, j) => `条件${j + 1}`);
  return {
    testId: 'cochran-q',
    method: 'コクランのQ検定',
    statLabel: 'Q値',
    statValue: q,
    df: String(df),
    pValue: p,
    approxNote:
      'p値はχ²近似による値です。対象数が小さい場合（目安：対象数×条件数 < 24）は近似精度が下がります。',
    extraStats: labels.map((label, j) => ({
      label: `${label}の成功数（1の数）`,
      value: `${colSums[j]} / ${n}`,
    })),
  };
}
