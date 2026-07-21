import { forwardRef } from 'react';
import { mean } from 'simple-statistics';
import { CHART_GRID, CHART_LINE_EMPHASIS, CHART_TEXT_MAIN, CHART_TEXT_SUB } from './palette';
import { computeTicks, formatTick } from './ticks';

interface ScatterPlotProps {
  x: number[];
  y: number[];
  xLabel: string;
  yLabel: string;
  title?: string;
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  /** y軸目盛りの刻み幅（未指定なら範囲を5等分する） */
  yTickStep?: number;
}

/** 散布点の塗り・線の色（回帰直線との区別のため点はやや明るいグレーにする） */
const POINT_COLOR = '#475569';

const WIDTH = 640;
const HEIGHT = 360;
const TITLE_H = 28;
const MARGIN = { top: 20, right: 20, bottom: 44, left: 56 };

/** 最小二乗法による回帰直線の傾き・切片 */
function leastSquares(x: number[], y: number[]): { slope: number; intercept: number } | null {
  const mx = mean(x);
  const my = mean(y);
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < x.length; i++) {
    sxy += (x[i] - mx) * (y[i] - my);
    sxx += (x[i] - mx) ** 2;
  }
  if (sxx === 0) return null;
  const slope = sxy / sxx;
  return { slope, intercept: my - slope * mx };
}

/** 2変数の散布図＋最小二乗回帰直線 */
const ScatterPlot = forwardRef<SVGSVGElement, ScatterPlotProps>(function ScatterPlot(
  {
    x,
    y,
    xLabel,
    yLabel,
    title,
    xMin: xMinOverride,
    xMax: xMaxOverride,
    yMin: yMinOverride,
    yMax: yMaxOverride,
    yTickStep,
  },
  ref,
) {
  const plotW = WIDTH - MARGIN.left - MARGIN.right;
  const plotH = HEIGHT - MARGIN.top - MARGIN.bottom;
  if (x.length === 0) return null;

  const xMin0 = Math.min(...x);
  const xMax0 = Math.max(...x);
  const yMin0 = Math.min(...y);
  const yMax0 = Math.max(...y);
  const xPad = (xMax0 - xMin0) * 0.1 || 1;
  const yPad = (yMax0 - yMin0) * 0.1 || 1;
  let xMin = xMin0 - xPad;
  let xMax = xMax0 + xPad;
  let yMin = yMin0 - yPad;
  let yMax = yMax0 + yPad;
  if (xMinOverride !== undefined) xMin = xMinOverride;
  if (xMaxOverride !== undefined) xMax = xMaxOverride;
  if (yMinOverride !== undefined) yMin = yMinOverride;
  if (yMaxOverride !== undefined) yMax = yMaxOverride;

  const xScale = (v: number) => ((v - xMin) / (xMax - xMin)) * plotW;
  const yScale = (v: number) => plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const line = leastSquares(x, y);
  const xTicks = computeTicks(xMin, xMax);
  const yTicks = computeTicks(yMin, yMax, yTickStep);
  const titleOffset = title ? TITLE_H : 0;
  const svgHeight = HEIGHT + titleOffset;

  return (
    <div className="overflow-x-auto">
      <svg
        ref={ref}
        viewBox={`0 0 ${WIDTH} ${svgHeight}`}
        role="img"
        aria-label={title ? `${title}（散布図）` : `${xLabel}と${yLabel}の散布図`}
        className="mx-auto min-w-[480px]"
      >
        {title && (
          <text x={WIDTH / 2} y={20} textAnchor="middle" fontSize={14} fontWeight="bold" fill={CHART_TEXT_MAIN}>
            {title}
          </text>
        )}
        <g transform={`translate(${MARGIN.left},${MARGIN.top + titleOffset})`}>
          {yTicks.map((v) => (
            <g key={`y${v}`}>
              <line x1={0} x2={plotW} y1={yScale(v)} y2={yScale(v)} stroke={CHART_GRID} strokeWidth={1} />
              <text x={-8} y={yScale(v)} textAnchor="end" dominantBaseline="middle" fontSize={11} fill={CHART_TEXT_SUB}>
                {formatTick(v, yTickStep)}
              </text>
            </g>
          ))}
          {xTicks.map((v) => (
            <text
              key={`x${v}`}
              x={xScale(v)}
              y={plotH + 18}
              textAnchor="middle"
              fontSize={11}
              fill={CHART_TEXT_SUB}
            >
              {v.toFixed(1)}
            </text>
          ))}

          {line && (
            <line
              x1={xScale(xMin0)}
              x2={xScale(xMax0)}
              y1={yScale(line.slope * xMin0 + line.intercept)}
              y2={yScale(line.slope * xMax0 + line.intercept)}
              stroke={CHART_LINE_EMPHASIS}
              strokeWidth={2}
              strokeDasharray="6 4"
            />
          )}

          {x.map((xv, i) => (
            <circle
              key={i}
              cx={xScale(xv)}
              cy={yScale(y[i])}
              r={4.5}
              fill={POINT_COLOR}
              fillOpacity={0.75}
              stroke={POINT_COLOR}
              strokeWidth={1}
            >
              <title>{`(${xv}, ${y[i]})`}</title>
            </circle>
          ))}

          <line x1={0} x2={0} y1={0} y2={plotH} stroke={CHART_GRID} strokeWidth={1} />
          <line x1={0} x2={plotW} y1={plotH} y2={plotH} stroke={CHART_GRID} strokeWidth={1} />

          <text
            x={plotW / 2}
            y={plotH + 38}
            textAnchor="middle"
            fontSize={12}
            fontWeight="bold"
            fill={CHART_TEXT_MAIN}
          >
            {xLabel}
          </text>
          <text
            x={-plotH / 2}
            y={-40}
            textAnchor="middle"
            fontSize={12}
            fontWeight="bold"
            fill={CHART_TEXT_MAIN}
            transform="rotate(-90)"
          >
            {yLabel}
          </text>
        </g>
      </svg>
    </div>
  );
});

export default ScatterPlot;
