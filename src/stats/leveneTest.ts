import jStat from 'jstat';
import { mean } from 'simple-statistics';
import type { TestResult } from '../types';
import { StatError, summarize } from './utils';

/** ルビーン検定（平均値中心・2群以上の等分散性の検定） */
export function leveneTest(groups: number[][]): TestResult {
  const k = groups.length;
  if (k < 2) {
    throw new StatError('2群以上のデータが必要です。');
  }
  for (const g of groups) {
    if (g.length < 2) {
      throw new StatError('各群に2つ以上のデータが必要です。');
    }
  }
  // 各データと群平均との絶対偏差 z に対して一元配置分散分析を行う
  const zGroups = groups.map((g) => {
    const m = mean(g);
    return g.map((v) => Math.abs(v - m));
  });
  const N = groups.reduce((s, g) => s + g.length, 0);
  const zAll = zGroups.flat();
  const zGrand = mean(zAll);
  const zMeans = zGroups.map((z) => mean(z));

  let ssb = 0;
  let ssw = 0;
  zGroups.forEach((z, i) => {
    ssb += z.length * (zMeans[i] - zGrand) ** 2;
    for (const v of z) ssw += (v - zMeans[i]) ** 2;
  });
  const dfB = k - 1;
  const dfW = N - k;
  if (ssw === 0) {
    throw new StatError('群内のばらつきが0のため、検定を実行できません。');
  }
  const w = (ssb / dfB) / (ssw / dfW);
  const p = 1 - jStat.centralF.cdf(w, dfB, dfW);

  const labels = groups.map((_, i) => `群${i + 1}`);
  return {
    testId: 'levene-test',
    method: 'ルビーン検定（平均値中心）',
    statLabel: 'W値（F統計量）',
    statValue: w,
    df: `${dfB}, ${dfW}`,
    pValue: p,
    approxNote:
      '各データと群平均との絶対偏差に対する分散分析です。中央値中心の変種（ブラウン＝フォーサイス検定）はより頑健とされています。',
    summaries: summarize(groups, labels),
  };
}
