/**
 * グラフ用のグレースケールパレット（白黒印刷でも判別できるよう、隣接する系列間で
 * 明度差が大きくなる順に並べている）。
 */
export const CHART_COLORS = ['#1E293B', '#94A3B8', '#475569', '#CBD5E1'] as const;

/** 群数に応じて色を割り当てる（4色を超える場合は循環させる） */
export function colorFor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length];
}

export const CHART_TEXT_MAIN = '#1E293B';
export const CHART_TEXT_SUB = '#64748B';
export const CHART_GRID = '#E2E8F0';
/** 基準線・回帰直線など、データ系列と区別したい要素に使う濃い色 */
export const CHART_LINE_EMPHASIS = '#0F172A';
