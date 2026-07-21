import jStat from 'jstat';
import type { TestResult } from '../types';
import { interpretR } from './effectSize';
import { rankWithTies, StatError, summarize, tieCorrectionSum } from './utils';

/** マン・ホイットニーU検定（正規近似・同順位補正・連続性補正・両側） */
export function mannWhitneyU(a: number[], b: number[]): TestResult {
  const n1 = a.length;
  const n2 = b.length;
  if (n1 < 1 || n2 < 1) {
    throw new StatError('各群に1つ以上のデータが必要です。');
  }
  const combined = [...a, ...b];
  const N = n1 + n2;
  const ranks = rankWithTies(combined);
  const r1 = ranks.slice(0, n1).reduce((s, r) => s + r, 0);
  const u1 = n1 * n2 + (n1 * (n1 + 1)) / 2 - r1;
  const u2 = n1 * n2 - u1;
  const u = Math.min(u1, u2);

  const mu = (n1 * n2) / 2;
  const tieSum = tieCorrectionSum(combined);
  const sigma2 = ((n1 * n2) / 12) * (N + 1 - tieSum / (N * (N - 1)));
  if (sigma2 <= 0) {
    throw new StatError('すべての値が同一のため、検定を実行できません。');
  }
  const sigma = Math.sqrt(sigma2);
  const z = Math.max(0, Math.abs(u - mu) - 0.5) / sigma;
  const p = Math.min(1, 2 * (1 - jStat.normal.cdf(z, 0, 1)));

  return {
    testId: 'mann-whitney-u',
    method: 'マン・ホイットニーU検定（両側）',
    statLabel: 'U値',
    statValue: u,
    pValue: p,
    effectSizes: [
      {
        label: '効果量 r（|z|/√N）',
        value: z / Math.sqrt(N),
        interpretation: interpretR(z / Math.sqrt(N)),
      },
    ],
    approxNote:
      'p値は正規近似（同順位補正・連続性補正あり）による値です。サンプル数が非常に小さい場合（各群10未満の目安）は近似精度が下がります。',
    summaries: summarize([a, b], ['群A', '群B']),
    extraStats: [
      { label: 'U₁（群A基準）', value: u1.toFixed(1) },
      { label: 'U₂（群B基準）', value: u2.toFixed(1) },
      { label: 'z値', value: z.toFixed(4) },
      { label: '群Aの順位和', value: r1.toFixed(1) },
    ],
  };
}
