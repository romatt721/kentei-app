import type { TestResult } from '../types';
import { logChoose } from './normal';
import { StatError, summarize } from './utils';

/** 符号検定（正確二項検定・両側） */
export function signTest(a: number[], b: number[]): TestResult {
  if (a.length !== b.length) {
    throw new StatError('2つの条件のデータ数が一致していません。');
  }
  const diffs = a.map((v, i) => v - b[i]).filter((d) => d !== 0);
  const n = diffs.length;
  if (n < 1) {
    throw new StatError('すべてのペアの差が0のため、検定を実行できません。');
  }
  const pos = diffs.filter((d) => d > 0).length;
  const neg = n - pos;
  const kMin = Math.min(pos, neg);

  // P(X ≤ kMin), X ~ B(n, 0.5) を対数で安全に計算
  let cdf = 0;
  for (let i = 0; i <= kMin; i++) {
    cdf += Math.exp(logChoose(n, i) + n * Math.log(0.5));
  }
  const p = Math.min(1, 2 * cdf);

  return {
    testId: 'sign-test',
    method: '符号検定（正確二項検定・両側）',
    statLabel: '正の符号の数',
    statValue: pos,
    pValue: p,
    approxNote: '差が0のペアは除外して計算しています。p値は二項分布による正確な値です。',
    summaries: summarize([a, b], ['条件A', '条件B']),
    extraStats: [
      { label: '正の差（A > B）', value: String(pos) },
      { label: '負の差（A < B）', value: String(neg) },
      { label: '有効ペア数（差≠0）', value: String(n) },
    ],
  };
}
