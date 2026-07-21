import jStat from 'jstat';
import type { TestResult } from '../types';
import { normInv } from './normal';
import { sampleVariance, StatError, summarize } from './utils';

/**
 * シャピロ・ウィルク検定（正規性検定）
 * Royston (1995) のアルゴリズム AS R94 に基づく実装。3 ≤ n ≤ 5000 で有効。
 */
export function shapiroWilk(data: number[]): TestResult {
  const n = data.length;
  if (n < 3) {
    throw new StatError('3つ以上のデータが必要です。');
  }
  if (n > 5000) {
    throw new StatError('この検定は5000件以下のデータにのみ対応しています。');
  }
  if (sampleVariance(data) === 0) {
    throw new StatError('すべての値が同一のため、検定を実行できません。');
  }

  const x = [...data].sort((a, b) => a - b);

  // 正規分布の順序統計量の期待値の近似
  const m = Array.from({ length: n }, (_, i) =>
    normInv((i + 1 - 0.375) / (n + 0.25)),
  );
  const ssm = m.reduce((s, v) => s + v * v, 0);

  // 係数 a の計算（末端2つを多項式で補正）
  const a = new Array<number>(n);
  const u = 1 / Math.sqrt(n);
  const sqrtSsm = Math.sqrt(ssm);
  if (n === 3) {
    a[0] = -Math.SQRT1_2;
    a[1] = 0;
    a[2] = Math.SQRT1_2;
  } else {
    const an =
      -2.706056 * u ** 5 +
      4.434685 * u ** 4 -
      2.07119 * u ** 3 -
      0.147981 * u ** 2 +
      0.221157 * u +
      m[n - 1] / sqrtSsm;
    if (n > 5) {
      const an1 =
        -3.582633 * u ** 5 +
        5.682633 * u ** 4 -
        1.752461 * u ** 3 -
        0.293762 * u ** 2 +
        0.042981 * u +
        m[n - 2] / sqrtSsm;
      const phi =
        (ssm - 2 * m[n - 1] ** 2 - 2 * m[n - 2] ** 2) /
        (1 - 2 * an ** 2 - 2 * an1 ** 2);
      const sqrtPhi = Math.sqrt(phi);
      for (let i = 2; i < n - 2; i++) a[i] = m[i] / sqrtPhi;
      a[n - 1] = an;
      a[n - 2] = an1;
      a[0] = -an;
      a[1] = -an1;
    } else {
      const phi = (ssm - 2 * m[n - 1] ** 2) / (1 - 2 * an ** 2);
      const sqrtPhi = Math.sqrt(phi);
      for (let i = 1; i < n - 1; i++) a[i] = m[i] / sqrtPhi;
      a[n - 1] = an;
      a[0] = -an;
    }
  }

  const meanX = x.reduce((s, v) => s + v, 0) / n;
  const numerator = x.reduce((s, v, i) => s + a[i] * v, 0) ** 2;
  const denominator = x.reduce((s, v) => s + (v - meanX) ** 2, 0);
  let w = numerator / denominator;
  w = Math.min(1 - 1e-15, Math.max(0, w));

  // p値（Roystonの正規化変換）
  let p: number;
  if (n === 3) {
    p = (6 / Math.PI) * (Math.asin(Math.sqrt(w)) - Math.asin(Math.sqrt(0.75)));
    p = Math.min(1, Math.max(0, p));
  } else {
    let z: number;
    if (n <= 11) {
      const g = -2.273 + 0.459 * n;
      const wt = -Math.log(g - Math.log(1 - w));
      const mu = 0.544 - 0.39978 * n + 0.025054 * n ** 2 - 0.0006714 * n ** 3;
      const sigma = Math.exp(
        1.3822 - 0.77857 * n + 0.062767 * n ** 2 - 0.0020322 * n ** 3,
      );
      z = (wt - mu) / sigma;
    } else {
      const lw = Math.log(1 - w);
      const lnN = Math.log(n);
      const mu = -1.5861 - 0.31082 * lnN - 0.083751 * lnN ** 2 + 0.0038915 * lnN ** 3;
      const sigma = Math.exp(-0.4803 - 0.082676 * lnN + 0.0030302 * lnN ** 2);
      z = (lw - mu) / sigma;
    }
    p = 1 - jStat.normal.cdf(z, 0, 1);
  }

  return {
    testId: 'shapiro-wilk',
    method: 'シャピロ・ウィルク検定（正規性の検定）',
    statLabel: 'W値',
    statValue: w,
    pValue: p,
    approxNote:
      'p値が有意（小さい）な場合、「正規分布に従う」という帰無仮説が棄却されます。つまりp値が大きいほど正規分布とみなしやすいデータです。',
    summaries: summarize([data], ['データ']),
  };
}
