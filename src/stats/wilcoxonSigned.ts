import jStat from 'jstat';
import type { TestResult } from '../types';
import { interpretR } from './effectSize';
import { rankWithTies, StatError, summarize, tieCorrectionSum } from './utils';

/** ウィルコクソン符号順位検定（正規近似・同順位補正・連続性補正・両側） */
export function wilcoxonSigned(a: number[], b: number[]): TestResult {
  if (a.length !== b.length) {
    throw new StatError('2つの条件のデータ数が一致していません。');
  }
  const diffs = a.map((v, i) => v - b[i]).filter((d) => d !== 0);
  const n = diffs.length;
  if (n < 1) {
    throw new StatError(
      'すべてのペアの差が0のため、検定を実行できません。',
    );
  }
  const absDiffs = diffs.map((d) => Math.abs(d));
  const ranks = rankWithTies(absDiffs);
  let wPlus = 0;
  let wMinus = 0;
  diffs.forEach((d, i) => {
    if (d > 0) wPlus += ranks[i];
    else wMinus += ranks[i];
  });
  const w = Math.min(wPlus, wMinus);

  const mu = (n * (n + 1)) / 4;
  const tieSum = tieCorrectionSum(absDiffs);
  const sigma2 = (n * (n + 1) * (2 * n + 1)) / 24 - tieSum / 48;
  if (sigma2 <= 0) {
    throw new StatError('差のばらつきが小さすぎるため、検定を実行できません。');
  }
  const sigma = Math.sqrt(sigma2);
  const z = Math.max(0, Math.abs(w - mu) - 0.5) / sigma;
  const p = Math.min(1, 2 * (1 - jStat.normal.cdf(z, 0, 1)));

  return {
    testId: 'wilcoxon-signed-rank',
    method: 'ウィルコクソン符号順位検定（両側）',
    statLabel: 'W値',
    statValue: w,
    pValue: p,
    effectSizes: [
      {
        label: '効果量 r（|z|/√n）',
        value: z / Math.sqrt(n),
        interpretation: interpretR(z / Math.sqrt(n)),
      },
    ],
    approxNote:
      'p値は正規近似（同順位補正・連続性補正あり）による値です。差が0のペアは除外して計算しています。有効ペア数が10未満の場合は近似精度が下がります。',
    summaries: summarize([a, b], ['条件A', '条件B']),
    extraStats: [
      { label: 'W⁺（正の順位和）', value: wPlus.toFixed(1) },
      { label: 'W⁻（負の順位和）', value: wMinus.toFixed(1) },
      { label: 'z値', value: z.toFixed(4) },
      { label: '有効ペア数（差≠0）', value: String(n) },
    ],
  };
}
