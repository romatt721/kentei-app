import { forwardRef } from 'react';
import { CHART_GRID, CHART_TEXT_MAIN, CHART_TEXT_SUB, colorFor } from './palette';
import { computeTicks, formatTick } from './ticks';

interface Series {
  label: string;
  values: number[];
}

interface GroupedBarProps {
  /** x軸のカテゴリラベル */
  categories: string[];
  /** 系列（凡例に表示。1系列のときは凡例を省略） */
  series: Series[];
  yAxisLabel?: string;
  title?: string;
  /** y軸の最小値・最大値（未指定なら自動計算、最小値は通常0） */
  yMin?: number;
  yMax?: number;
  /** y軸目盛りの刻み幅（未指定なら範囲を5等分する） */
  yTickStep?: number;
}

const WIDTH = 560;
const HEIGHT = 320;
const TITLE_H = 28;
const MARGIN = { top: 20, right: 20, bottom: 56, left: 56 };

/** カテゴリ×系列の棒グラフ（分割表・適合度検定の度数表示に使用） */
const GroupedBar = forwardRef<SVGSVGElement, GroupedBarProps>(function GroupedBar(
  { categories, series, yAxisLabel, title, yMin: yMinOverride, yMax: yMaxOverride, yTickStep },
  ref,
) {
  const plotW = WIDTH - MARGIN.left - MARGIN.right;
  const plotH = HEIGHT - MARGIN.top - MARGIN.bottom - (series.length > 1 ? 24 : 0);
  const allValues = series.flatMap((s) => s.values);
  if (allValues.length === 0) return null;

  const yMin = yMinOverride ?? 0;
  const yMax = yMaxOverride ?? (Math.max(...allValues, 0) * 1.15 || 1);
  const yScale = (v: number) => plotH - ((v - yMin) / (yMax - yMin)) * plotH;
  const groupWidth = plotW / categories.length;
  const barGap = 4;
  const barWidth = Math.min(48, (groupWidth - barGap * (series.length + 1)) / series.length);

  const tickValues = computeTicks(yMin, yMax, yTickStep);
  const titleOffset = title ? TITLE_H : 0;
  const svgHeight = HEIGHT + titleOffset;

  return (
    <div className="overflow-x-auto">
      <svg
        ref={ref}
        viewBox={`0 0 ${WIDTH} ${svgHeight}`}
        role="img"
        aria-label={title ? `${title}（棒グラフ）` : 'カテゴリごとの度数を示す棒グラフ'}
        className="mx-auto min-w-[420px]"
      >
        {title && (
          <text x={WIDTH / 2} y={20} textAnchor="middle" fontSize={14} fontWeight="bold" fill={CHART_TEXT_MAIN}>
            {title}
          </text>
        )}
        <g transform={`translate(${MARGIN.left},${MARGIN.top + titleOffset})`}>
          {tickValues.map((v) => (
            <g key={v}>
              <line x1={0} x2={plotW} y1={yScale(v)} y2={yScale(v)} stroke={CHART_GRID} strokeWidth={1} />
              <text x={-8} y={yScale(v)} textAnchor="end" dominantBaseline="middle" fontSize={11} fill={CHART_TEXT_SUB}>
                {yTickStep ? formatTick(v, yTickStep) : Math.round(v * 100) / 100}
              </text>
            </g>
          ))}

          {categories.map((cat, ci) => {
            const groupX = groupWidth * ci;
            const totalBarsWidth = barWidth * series.length + barGap * (series.length - 1);
            const startX = groupX + (groupWidth - totalBarsWidth) / 2;
            return (
              <g key={ci}>
                {series.map((s, si) => {
                  const v = s.values[ci] ?? 0;
                  const x = startX + si * (barWidth + barGap);
                  const h = Math.max(0, plotH - yScale(v));
                  return (
                    <rect
                      key={si}
                      x={x}
                      y={yScale(v)}
                      width={barWidth}
                      height={h}
                      fill={colorFor(si)}
                      stroke={CHART_TEXT_MAIN}
                      strokeWidth={1}
                      rx={3}
                    >
                      <title>{`${cat} / ${s.label}: ${v}`}</title>
                    </rect>
                  );
                })}
                <text
                  x={groupX + groupWidth / 2}
                  y={plotH + 18}
                  textAnchor="middle"
                  fontSize={11}
                  fill={CHART_TEXT_MAIN}
                >
                  {cat}
                </text>
              </g>
            );
          })}

          <line x1={0} x2={0} y1={0} y2={plotH} stroke={CHART_GRID} strokeWidth={1} />
          <line x1={0} x2={plotW} y1={plotH} y2={plotH} stroke={CHART_GRID} strokeWidth={1} />

          {yAxisLabel && (
            <text
              x={-plotH / 2}
              y={-40}
              textAnchor="middle"
              fontSize={12}
              fontWeight="bold"
              fill={CHART_TEXT_MAIN}
              transform="rotate(-90)"
            >
              {yAxisLabel}
            </text>
          )}

          {series.length > 1 && (
            <g transform={`translate(0, ${plotH + 36})`}>
              {series.map((s, si) => (
                <g key={si} transform={`translate(${si * 120}, 0)`}>
                  <rect
                    width={12}
                    height={12}
                    fill={colorFor(si)}
                    stroke={CHART_TEXT_MAIN}
                    strokeWidth={1}
                    rx={2}
                  />
                  <text x={18} y={10} fontSize={11} fill={CHART_TEXT_MAIN}>
                    {s.label}
                  </text>
                </g>
              ))}
            </g>
          )}
        </g>
      </svg>
    </div>
  );
});

export default GroupedBar;
