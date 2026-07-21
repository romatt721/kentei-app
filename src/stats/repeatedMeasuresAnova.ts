import jStat from 'jstat';
import { mean } from 'simple-statistics';
import type { TestResult } from '../types';
import { interpretEta } from './effectSize';
import { StatError, summarize } from './utils';

/**
 * 反復測定分散分析（一要因・被験者内計画）
 * @param conds 条件ごとのデータ列。全条件で同じ対象を測定（conds[条件][対象]）
 */
export function repeatedMeasuresAnova(conds: number[][]): TestResult {
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

  const grand = mean(conds.flat());
  const condMeans = conds.map((c) => mean(c));
  const subjMeans = Array.from({ length: n }, (_, i) =>
    mean(conds.map((c) => c[i])),
  );

  const ssCond = n * condMeans.reduce((s, m) => s + (m - grand) ** 2, 0);
  const ssSubj = k * subjMeans.reduce((s, m) => s + (m - grand) ** 2, 0);
  let ssTotal = 0;
  for (const c of conds) {
    for (const v of c) ssTotal += (v - grand) ** 2;
  }
  const ssErr = ssTotal - ssCond - ssSubj;

  const dfCond = k - 1;
  const dfErr = (k - 1) * (n - 1);
  const msCond = ssCond / dfCond;
  const msErr = ssErr / dfErr;
  if (msErr <= 1e-12) {
    throw new StatError('誤差のばらつきが0のため、F値を計算できません。');
  }
  const f = msCond / msErr;
  const p = 1 - jStat.centralF.cdf(f, dfCond, dfErr);

  const labels = conds.map((_, j) => `条件${j + 1}`);
  return {
    testId: 'repeated-measures-anova',
    method: '反復測定分散分析（一要因・被験者内）',
    statLabel: 'F値',
    statValue: f,
    df: `${dfCond}, ${dfErr}`,
    pValue: p,
    effectSizes: [
      {
        label: '偏η²（条件）',
        value: ssCond / (ssCond + ssErr),
        interpretation: interpretEta(ssCond / (ssCond + ssErr)),
      },
    ],
    approxNote:
      '球面性の仮定を前提とした結果です（Greenhouse-Geisser等の補正は行っていません）。球面性が疑わしい場合はp値が小さめに出ることがあります。',
    summaries: summarize(conds, labels),
    extraStats: [
      { label: '条件平方和', value: ssCond.toFixed(4) },
      { label: '個人差平方和', value: ssSubj.toFixed(4) },
      { label: '誤差平方和', value: ssErr.toFixed(4) },
    ],
  };
}
