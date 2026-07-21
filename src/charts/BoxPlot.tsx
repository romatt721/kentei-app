import { forwardRef } from 'react';
import { max, min, quantile } from 'simple-statistics';
import { CHART_GRID, CHART_LINE_EMPHASIS, CHART_TEXT_MAIN, CHART_TEXT_SUB, colorFor } from './palette';
import { computeTicks, formatTick } from './ticks';

interface BoxPlotProps {
  groups: { label: string; values: number[] }[];
  /** 基準値の水平線を描く場合（1標本t検定のμ₀など） */
  referenceLine?: { value: number; label: string };
  /** グラフ上部に表示するタイトル */
  title?: string;
  /** y軸のラベル */
  yAxisLabel?: string;
  /** y軸の最小値・最大値（未指定なら自動計算） */
  yMin?: number;
  yMax?: number;
  /** y軸目盛りの刻み幅（未指定なら範囲を5等分する） */
  yTickStep?: number;
}

const WIDTH = 640;
const HEIGHT = 320;
const TITLE_H = 28;
const MARGIN = { top: 20, right: 20, bottom: 44, left: 64 };

/** 群ごとの分布を箱ひげ図＋個々の点（ジッター）で表示する */
const BoxPlot = forwardRef<SVGSVGElement, BoxPlotProps>(function BoxPlot(
  { groups, referenceLine, title, yAxisLabel, yMin: yMinOverride, yMax: yMaxOverride, yTickStep },
  ref,
) {
  const plotW = WIDTH - MARGIN.left - MARGIN.right;
  const plotH = HEIGHT - MARGIN.top - MARGIN.bottom;
  const allValues = groups.flatMap((g) => g.values);
  if (allValues.length === 0) return null;

  let yMin = min(allValues);
  let yMax = max(allValues);
  if (referenceLine) {
    yMin = Math.min(yMin, referenceLine.value);
    yMax = Math.max(yMax, referenceLine.value);
  }
  const pad = (yMax - yMin) * 0.1 || 1;
  yMin -= pad;
  yMax += pad;
  if (yMinOverride !== undefined) yMin = yMinOverride;
  if (yMaxOverride !== undefined) yMax = yMaxOverride;

  const yScale = (v: number) => plotH - ((v - yMin) / (yMax - yMin)) * plotH;
  const bandWidth = plotW / groups.length;
  const boxWidth = Math.min(56, bandWidth * 0.5);

  const tickValues = computeTicks(yMin, yMax, yTickStep);
  const titleOffset = title ? TITLE_H : 0;
  const svgHeight = HEIGHT + titleOffset;

  return (
    <div className="overflow-x-auto">
      <svg
        ref={ref}
        viewBox={`0 0 ${WIDTH} ${svgHeight}`}
        role="img"
        aria-label={title ? `${title}（箱ひげ図）` : '群ごとのデータ分布を示す箱ひげ図'}
        className="mx-auto min-w-[480px]"
      >
        {title && (
          <text x={WIDTH / 2} y={20} textAnchor="middle" fontSize={14} fontWeight="bold" fill={CHART_TEXT_MAIN}>
            {title}
          </text>
        )}
        <g transform={`translate(${MARGIN.left},${MARGIN.top + titleOffset})`}>
          {/* y軸グリッド線・目盛りラベル */}
          {tickValues.map((v) => (
            <g key={v}>
              <line
                x1={0}
                x2={plotW}
                y1={yScale(v)}
                y2={yScale(v)}
                stroke={CHART_GRID}
                strokeWidth={1}
              />
              <text
                x={-8}
                y={yScale(v)}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize={11}
                fill={CHART_TEXT_SUB}
              >
                {formatTick(v, yTickStep)}
              </text>
            </g>
          ))}

          {/* 基準値の水平線 */}
          {referenceLine && (
            <g>
              <line
                x1={0}
                x2={plotW}
                y1={yScale(referenceLine.value)}
                y2={yScale(referenceLine.value)}
                stroke={CHART_LINE_EMPHASIS}
                strokeWidth={2}
                strokeDasharray="6 4"
              />
              <text
                x={plotW}
                y={yScale(referenceLine.value) - 6}
                textAnchor="end"
                fontSize={11}
                fill={CHART_LINE_EMPHASIS}
                fontWeight="bold"
              >
                {referenceLine.label}
              </text>
            </g>
          )}

          {groups.map((g, i) => {
            const cx = bandWidth * i + bandWidth / 2;
            const color = colorFor(i);
            if (g.values.length === 0) return null;
            const q1 = quantile(g.values, 0.25);
            const q2 = quantile(g.values, 0.5);
            const q3 = quantile(g.values, 0.75);
            const lo = min(g.values);
            const hi = max(g.values);
            // 単純な擬似乱数（決定的）でジッターさせる
            const jitter = (idx: number) => {
              const s = Math.sin(idx * 999.7 + i * 13.1) * 10000;
              return (s - Math.floor(s) - 0.5) * boxWidth * 0.7;
            };
            return (
              <g key={i}>
                {/* ひげ */}
                <line
                  x1={cx}
                  x2={cx}
                  y1={yScale(hi)}
                  y2={yScale(q3)}
                  stroke={CHART_TEXT_SUB}
                  strokeWidth={1.5}
                />
                <line
                  x1={cx}
                  x2={cx}
                  y1={yScale(q1)}
                  y2={yScale(lo)}
                  stroke={CHART_TEXT_SUB}
                  strokeWidth={1.5}
                />
                {/* 箱 */}
                <rect
                  x={cx - boxWidth / 2}
                  y={yScale(q3)}
                  width={boxWidth}
                  height={Math.max(1, yScale(q1) - yScale(q3))}
                  fill={color}
                  fillOpacity={0.35}
                  stroke={color}
                  strokeWidth={2}
                  rx={2}
                />
                {/* 中央値ライン */}
                <line
                  x1={cx - boxWidth / 2}
                  x2={cx + boxWidth / 2}
                  y1={yScale(q2)}
                  y2={yScale(q2)}
                  stroke={color}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
                {/* 個々の点（ジッター表示、n≤40のときのみ） */}
                {g.values.length <= 40 &&
                  g.values.map((v, idx) => (
                    <circle
                      key={idx}
                      cx={cx + jitter(idx)}
                      cy={yScale(v)}
                      r={3}
                      fill={color}
                      fillOpacity={0.8}
                    >
                      <title>{`${g.label}: ${v}`}</title>
                    </circle>
                  ))}
                {/* x軸ラベル */}
                <text
                  x={cx}
                  y={plotH + 20}
                  textAnchor="middle"
                  fontSize={12}
                  fontWeight="bold"
                  fill={CHART_TEXT_MAIN}
                >
                  {g.label}
                </text>
                <text
                  x={cx}
                  y={plotH + 36}
                  textAnchor="middle"
                  fontSize={10}
                  fill={CHART_TEXT_SUB}
                >
                  n={g.values.length}
                </text>
              </g>
            );
          })}

          {/* 軸線 */}
          <line x1={0} x2={0} y1={0} y2={plotH} stroke={CHART_GRID} strokeWidth={1} />
          <line
            x1={0}
            x2={plotW}
            y1={plotH}
            y2={plotH}
            stroke={CHART_GRID}
            strokeWidth={1}
          />

          {yAxisLabel && (
            <text
              x={-plotH / 2}
              y={-48}
              textAnchor="middle"
              fontSize={12}
              fontWeight="bold"
              fill={CHART_TEXT_MAIN}
              transform="rotate(-90)"
            >
              {yAxisLabel}
            </text>
          )}
        </g>
      </svg>
    </div>
  );
});

export default BoxPlot;
