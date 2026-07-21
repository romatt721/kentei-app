import jStat from 'jstat';
import type { TestResult } from '../types';
import { interpretR } from './effectSize';
import { StatError } from './utils';

/**
 * フィッシャーの正確確率検定（2×2・両側）
 * 超幾何分布に基づき、観測された表以下の確率を持つすべての表の確率を合計する。
 */
export function fisherExact(observed: number[][]): TestResult {
  if (observed.length !== 2 || observed.some((r) => r.length !== 2)) {
    throw new StatError('2×2の分割表が必要です。');
  }
  const [[a, b], [c, d]] = observed;
  for (const v of [a, b, c, d]) {
    if (!Number.isInteger(v) || v < 0) {
      throw new StatError('度数には0以上の整数を入力してください。');
    }
  }
  const N = a + b + c + d;
  if (N === 0) {
    throw new StatError('少なくとも1つのセルに1以上の度数が必要です。');
  }

  const row1 = a + b; // 周辺度数（行1）
  const col1 = a + c; // 周辺度数（列1）

  // 超幾何分布 P(X = k)：母集団N・成功col1・抽出row1 から成功k個
  const pObs = jStat.hypgeom.pdf(a, N, col1, row1);

  // aが取りうる範囲のすべての表を列挙し、観測確率以下のものを合計（両側p値）
  const kMin = Math.max(0, row1 - (N - col1));
  const kMax = Math.min(row1, col1);
  let p = 0;
  const tolerance = 1 + 1e-7; // 浮動小数点誤差の吸収
  for (let k = kMin; k <= kMax; k++) {
    const pk = jStat.hypgeom.pdf(k, N, col1, row1);
    if (pk <= pObs * tolerance) p += pk;
  }
  p = Math.min(1, p);

  const extraStats = [
    { label: '観測された表の生起確率', value: pObs.toExponential(4) },
    { label: '総度数 N', value: String(N) },
  ];
  if (b * c > 0) {
    extraStats.push({
      label: 'オッズ比 (ad/bc)',
      value: ((a * d) / (b * c)).toFixed(4),
    });
  }

  // φ係数（すべての周辺度数が正のときのみ定義される）
  const marginProduct = row1 * (c + d) * col1 * (b + d);
  const effectSizes =
    marginProduct > 0
      ? [
          {
            label: 'φ係数',
            value: (a * d - b * c) / Math.sqrt(marginProduct),
            interpretation: interpretR((a * d - b * c) / Math.sqrt(marginProduct)),
          },
        ]
      : undefined;

  return {
    testId: 'fisher-exact',
    method: 'フィッシャーの正確確率検定（両側）',
    statLabel: 'p値（正確確率）',
    statValue: p,
    pValue: p,
    effectSizes,
    extraStats,
  };
}
