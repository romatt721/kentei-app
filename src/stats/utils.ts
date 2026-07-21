import { mean, median, sampleStandardDeviation } from 'simple-statistics';
import type { GroupSummary } from '../types';

/** 平均順位を割り当てる（同順位は平均順位）。返り値は元の並び順に対応する順位配列 */
export function rankWithTies(values: number[]): number[] {
  const indexed = values.map((v, i) => ({ v, i }));
  indexed.sort((a, b) => a.v - b.v);
  const ranks = new Array<number>(values.length);
  let pos = 0;
  while (pos < indexed.length) {
    let end = pos;
    while (end + 1 < indexed.length && indexed[end + 1].v === indexed[pos].v) {
      end++;
    }
    const avgRank = (pos + end) / 2 + 1; // 順位は1始まり
    for (let k = pos; k <= end; k++) {
      ranks[indexed[k].i] = avgRank;
    }
    pos = end + 1;
  }
  return ranks;
}

/** 同順位補正項 Σ(t³ - t) を計算する（tは各同順位グループのサイズ） */
export function tieCorrectionSum(values: number[]): number {
  const counts = new Map<number, number>();
  for (const v of values) {
    counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  let sum = 0;
  for (const t of counts.values()) {
    if (t > 1) sum += t ** 3 - t;
  }
  return sum;
}

/** 群ごとのサマリー統計を計算する */
export function summarize(groups: number[][], labels: string[]): GroupSummary[] {
  return groups.map((g, i) => ({
    label: labels[i] ?? `群${i + 1}`,
    n: g.length,
    mean: mean(g),
    median: median(g),
    sd: g.length >= 2 ? sampleStandardDeviation(g) : null,
  }));
}

/** 標本分散（不偏分散） */
export function sampleVariance(values: number[]): number {
  const m = mean(values);
  return values.reduce((s, v) => s + (v - m) ** 2, 0) / (values.length - 1);
}

/** 計算続行不能なデータのときに投げるエラー */
export class StatError extends Error {}
