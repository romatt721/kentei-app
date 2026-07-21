import jStat from 'jstat';
import type { TestResult } from '../types';
import { correlationLabel } from './pearsonCorrelation';
import { StatError, summarize } from './utils';

/** 同順位グループのサイズ一覧を返す */
function tieGroupSizes(values: number[]): number[] {
  const counts = new Map<number, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.values()].filter((t) => t > 1);
}

/** ケンドール順位相関係数（τb）の無相関検定（正規近似・両側） */
export function kendallTau(x: number[], y: number[]): TestResult {
  if (x.length !== y.length) {
    throw new StatError('2つの変数のデータ数が一致していません。');
  }
  const n = x.length;
  if (n < 3) {
    throw new StatError('3ペア以上のデータが必要です。');
  }

  // 協和対・不協和対を数える（n ≤ 500 なので全ペア走査で十分）
  let concordant = 0;
  let discordant = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const sign = (x[i] - x[j]) * (y[i] - y[j]);
      if (sign > 0) concordant++;
      else if (sign < 0) discordant++;
    }
  }
  const s = concordant - discordant;

  const tiesX = tieGroupSizes(x);
  const tiesY = tieGroupSizes(y);
  const n0 = (n * (n - 1)) / 2;
  const n1 = tiesX.reduce((sum, t) => sum + (t * (t - 1)) / 2, 0);
  const n2 = tiesY.reduce((sum, t) => sum + (t * (t - 1)) / 2, 0);
  const denom = Math.sqrt((n0 - n1) * (n0 - n2));
  if (denom === 0) {
    throw new StatError('一方の変数の値がすべて同一のため、τを計算できません。');
  }
  const tau = s / denom;

  // 正規近似の分散（同順位補正付き、Kendall 1970）
  const v0 = n * (n - 1) * (2 * n + 5);
  const vt = tiesX.reduce((sum, t) => sum + t * (t - 1) * (2 * t + 5), 0);
  const vu = tiesY.reduce((sum, t) => sum + t * (t - 1) * (2 * t + 5), 0);
  const sumT2 = tiesX.reduce((sum, t) => sum + t * (t - 1), 0);
  const sumU2 = tiesY.reduce((sum, t) => sum + t * (t - 1), 0);
  const sumT3 = tiesX.reduce((sum, t) => sum + t * (t - 1) * (t - 2), 0);
  const sumU3 = tiesY.reduce((sum, t) => sum + t * (t - 1) * (t - 2), 0);
  const variance =
    (v0 - vt - vu) / 18 +
    (sumT2 * sumU2) / (2 * n * (n - 1)) +
    (sumT3 * sumU3) / (9 * n * (n - 1) * (n - 2));
  if (variance <= 0) {
    throw new StatError('データのばらつきが小さすぎるため、検定を実行できません。');
  }
  const z = s / Math.sqrt(variance);
  const p = Math.min(1, 2 * (1 - jStat.normal.cdf(Math.abs(z), 0, 1)));

  return {
    testId: 'kendall-tau',
    method: 'ケンドール順位相関係数（τb）の無相関検定（正規近似・両側）',
    statLabel: 'z値',
    statValue: z,
    pValue: p,
    approxNote:
      'p値は正規近似（同順位補正あり）による値です。サンプル数10未満の場合は近似精度が下がります。',
    correlation: { r: tau, label: correlationLabel(tau) },
    summaries: summarize([x, y], ['変数X', '変数Y']),
    extraStats: [
      { label: '協和対の数 C', value: String(concordant) },
      { label: '不協和対の数 D', value: String(discordant) },
      { label: 'S = C − D', value: String(s) },
    ],
  };
}
