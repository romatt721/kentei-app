import jStat from 'jstat';
import type { TestResult } from '../types';
import { interpretEta } from './effectSize';
import { rankWithTies, StatError, summarize, tieCorrectionSum } from './utils';

/** クラスカル・ウォリス検定（χ²近似・同順位補正） */
export function kruskalWallis(groups: number[][]): TestResult {
  const k = groups.length;
  if (k < 3) {
    throw new StatError('3群以上のデータが必要です。');
  }
  for (const g of groups) {
    if (g.length < 1) {
      throw new StatError('各群に1つ以上のデータが必要です。');
    }
  }
  const all = groups.flat();
  const N = all.length;
  if (N <= k) {
    throw new StatError('データ数が少なすぎます。');
  }
  const ranks = rankWithTies(all);

  let h = 0;
  let offset = 0;
  const rankSums: number[] = [];
  for (const g of groups) {
    const rSum = ranks
      .slice(offset, offset + g.length)
      .reduce((s, r) => s + r, 0);
    rankSums.push(rSum);
    h += (rSum * rSum) / g.length;
    offset += g.length;
  }
  h = (12 / (N * (N + 1))) * h - 3 * (N + 1);

  // 同順位補正
  const tieSum = tieCorrectionSum(all);
  const c = 1 - tieSum / (N ** 3 - N);
  if (c <= 0) {
    throw new StatError('すべての値が同一のため、検定を実行できません。');
  }
  h = h / c;

  const df = k - 1;
  const p = 1 - jStat.chisquare.cdf(h, df);

  const labels = groups.map((_, i) => `群${i + 1}`);
  return {
    testId: 'kruskal-wallis',
    method: 'クラスカル・ウォリス検定',
    statLabel: 'H値',
    statValue: h,
    df: String(df),
    pValue: p,
    effectSizes: [
      {
        label: 'η²H（(H−k+1)/(N−k)）',
        value: Math.max(0, (h - k + 1) / (N - k)),
        interpretation: interpretEta(Math.max(0, (h - k + 1) / (N - k))),
      },
    ],
    approxNote:
      'p値はχ²近似（同順位補正あり）による値です。各群のサンプル数が5未満の場合は近似精度が下がります。',
    summaries: summarize(groups, labels),
    extraStats: labels.map((label, i) => ({
      label: `${label}の順位和`,
      value: rankSums[i].toFixed(1),
    })),
  };
}
