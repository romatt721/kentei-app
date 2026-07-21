import { forwardRef } from 'react';
import { CHART_GRID, CHART_TEXT_MAIN, CHART_TEXT_SUB } from './palette';
import { computeTicks, formatTick } from './ticks';

interface PairedSlopeProps {
  a: number[];
  b: number[];
  labelA: string;
  labelB: string;
  title?: string;
  yAxisLabel?: string;
  yMin?: number;
  yMax?: number;
  /** y軸目盛りの刻み幅（未指定なら範囲を5等分する） */
  yTickStep?: number;
}

const WIDTH = 480;
const HEIGHT = 340;
const TITLE_H = 28;
const MARGIN = { top: 20, right: 24, bottom: 40, left: 64 };
const LINE_COLOR = '#334155';
const POINT_COLOR = '#1E293B';

/** 対応のある2条件のデータを、対象ごとに線で結んだスロープグラフ */
const PairedSlope = forwardRef<SVGSVGElement, PairedSlopeProps>(function PairedSlope(
  { a, b, labelA, labelB, title, yAxisLabel, yMin: yMinOverride, yMax: yMaxOverride, yTickStep },
  ref,
) {
  const plotW = WIDTH - MARGIN.left - MARGIN.right;
  const plotH = HEIGHT - MARGIN.top - MARGIN.bottom;
  const all = [...a, ...b];
  if (all.length === 0) return null;

  const vMin0 = Math.min(...all);
  const vMax0 = Math.max(...all);
  const pad = (vMax0 - vMin0) * 0.1 || 1;
  let vMin = vMin0 - pad;
  let vMax = vMax0 + pad;
  if (yMinOverride !== undefined) vMin = yMinOverride;
  if (yMaxOverride !== undefined) vMax = yMaxOverride;
  const yScale = (v: number) => plotH - ((v - vMin) / (vMax - vMin)) * plotH;
  const xA = 0;
  const xB = plotW;

  const yTicks = computeTicks(vMin, vMax, yTickStep);
  const titleOffset = title ? TITLE_H : 0;
  const svgHeight = HEIGHT + titleOffset;

  return (
    <div className="overflow-x-auto">
      <svg
        ref={ref}
        viewBox={`0 0 ${WIDTH} ${svgHeight}`}
        role="img"
        aria-label={
          title ? `${title}（スロープグラフ）` : `${labelA}から${labelB}への対象ごとの変化を示すスロープグラフ`
        }
        className="mx-auto min-w-[360px]"
      >
        {title && (
          <text x={WIDTH / 2} y={20} textAnchor="middle" fontSize={14} fontWeight="bold" fill={CHART_TEXT_MAIN}>
            {title}
          </text>
        )}
        <g transform={`translate(${MARGIN.left},${MARGIN.top + titleOffset})`}>
          {yTicks.map((v) => (
            <g key={v}>
              <line x1={0} x2={plotW} y1={yScale(v)} y2={yScale(v)} stroke={CHART_GRID} strokeWidth={1} />
              <text x={-8} y={yScale(v)} textAnchor="end" dominantBaseline="middle" fontSize={11} fill={CHART_TEXT_SUB}>
                {formatTick(v, yTickStep)}
              </text>
            </g>
          ))}

          {a.map((av, i) => {
            const bv = b[i];
            return (
              <g key={i}>
                <line
                  x1={xA}
                  x2={xB}
                  y1={yScale(av)}
                  y2={yScale(bv)}
                  stroke={LINE_COLOR}
                  strokeWidth={1.5}
                  strokeOpacity={0.55}
                />
                <circle cx={xA} cy={yScale(av)} r={3.5} fill={POINT_COLOR}>
                  <title>{`${labelA}: ${av}`}</title>
                </circle>
                <circle cx={xB} cy={yScale(bv)} r={3.5} fill={POINT_COLOR}>
                  <title>{`${labelB}: ${bv}`}</title>
                </circle>
              </g>
            );
          })}

          <line x1={xA} x2={xA} y1={0} y2={plotH} stroke={CHART_GRID} strokeWidth={1} />
          <line x1={xB} x2={xB} y1={0} y2={plotH} stroke={CHART_GRID} strokeWidth={1} />

          <text x={xA} y={plotH + 20} textAnchor="middle" fontSize={12} fontWeight="bold" fill={CHART_TEXT_MAIN}>
            {labelA}
          </text>
          <text x={xB} y={plotH + 20} textAnchor="middle" fontSize={12} fontWeight="bold" fill={CHART_TEXT_MAIN}>
            {labelB}
          </text>

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

export default PairedSlope;
