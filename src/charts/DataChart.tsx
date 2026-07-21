import { useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Locale } from '../i18n/LocaleContext';
import { useLocale } from '../i18n/LocaleContext';
import { getRowLabel } from '../stats';
import type { ParamsState, TestDef } from '../types';
import BoxPlot from './BoxPlot';
import GroupedBar from './GroupedBar';
import PairedSlope from './PairedSlope';
import ScatterPlot from './ScatterPlot';
import { downloadSvgAsPngFile, downloadSvgAsSvgFile } from './svgDownload';

type ChartKind =
  | 'box' // 群ごとの分布（箱ひげ図）
  | 'boxWithMu0' // 単群の分布＋基準値の線（1標本t検定）
  | 'pairedSlope' // 対応のある2条件のスロープグラフ
  | 'scatter' // 2変数の散布図（相関検定）
  | 'matrixBar' // 分割表の度数（棒グラフ）
  | 'goodnessBar' // 観測度数 vs 期待度数（適合度検定）
  | 'successBar'; // 条件ごとの成功数（コクランのQ検定）

const CHART_KIND: Record<string, ChartKind> = {
  't-test-independent': 'box',
  'welch-t-test': 'box',
  'mann-whitney-u': 'box',
  'one-way-anova': 'box',
  'kruskal-wallis': 'box',
  'f-test-variance': 'box',
  'levene-test': 'box',
  'repeated-measures-anova': 'box',
  'friedman-test': 'box',
  'two-way-anova': 'box',
  'shapiro-wilk': 'box',
  't-test-one-sample': 'boxWithMu0',
  't-test-paired': 'pairedSlope',
  'wilcoxon-signed-rank': 'pairedSlope',
  'sign-test': 'pairedSlope',
  'pearson-correlation': 'scatter',
  'spearman-correlation': 'scatter',
  'kendall-tau': 'scatter',
  'chi-square-independence': 'matrixBar',
  'fisher-exact': 'matrixBar',
  'mcnemar-test': 'matrixBar',
  'chi-square-goodness': 'goodnessBar',
  'cochran-q': 'successBar',
};

interface DataChartProps {
  def: TestDef;
  params: ParamsState;
  rawData: number[][];
  columnLabels: string[];
  locale: Locale;
  /** 画面表示用にローカライズ済みの検定名（ファイル名・デフォルトタイトルに使用） */
  testName: string;
}

/** 空欄なら未指定（自動）として扱い、数値なら parse する */
function parseOptionalNumber(s: string): number | undefined {
  if (s.trim() === '') return undefined;
  const v = Number(s);
  return Number.isFinite(v) ? v : undefined;
}

/** ラベル配列を編集するテキスト入力群 */
function LabelEditors({
  title,
  labels,
  onChange,
}: {
  title: string;
  labels: string[];
  onChange: (i: number, v: string) => void;
}) {
  if (labels.length === 0) return null;
  return (
    <div className="mb-3">
      <p className="mb-1 text-xs font-bold text-textSub">{title}</p>
      <div className="flex flex-wrap gap-2">
        {labels.map((label, i) => (
          <input
            key={i}
            type="text"
            aria-label={`${title} ${i + 1}`}
            value={label}
            onChange={(e) => onChange(i, e.target.value)}
            className="w-32 rounded border border-border px-2 py-1 text-sm text-textMain focus:outline-none focus:ring-2 focus:ring-primary"
          />
        ))}
      </div>
    </div>
  );
}

/** 検定の種類に応じたグラフを描画する。保存（PNG/SVG）とタイトル・軸範囲・データ名の編集に対応する */
export default function DataChart({ def, params, rawData, columnLabels, locale, testName }: DataChartProps) {
  const { t } = useLocale();
  const kind = CHART_KIND[def.id];
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const rowLabels = useMemo(
    () => rawData.map((_, i) => getRowLabel(def, i, locale)),
    [def, rawData, locale],
  );

  const isScatter = kind === 'scatter';
  const isCategoryAxis = kind === 'matrixBar' || kind === 'goodnessBar' || kind === 'successBar';

  // 種類ごとの初期値（カテゴリ名＝横軸・データの名前、系列名＝凡例）
  let categoryDefault: string[];
  let seriesDefault: string[];
  let yAxisLabelDefault: string;
  switch (kind) {
    case 'matrixBar':
      categoryDefault = rowLabels;
      seriesDefault = columnLabels;
      yAxisLabelDefault = t('chart.defaultCountAxis');
      break;
    case 'goodnessBar':
      categoryDefault = rowLabels;
      seriesDefault = [t('chart.defaultObserved'), t('chart.defaultExpected')];
      yAxisLabelDefault = t('chart.defaultCountAxis');
      break;
    case 'successBar':
      categoryDefault = columnLabels;
      seriesDefault = [t('chart.defaultSuccessSeries')];
      yAxisLabelDefault = t('chart.defaultSuccessAxis');
      break;
    case 'scatter':
      categoryDefault = [];
      seriesDefault = [];
      yAxisLabelDefault = columnLabels[1] ?? '';
      break;
    default:
      // box / boxWithMu0 / pairedSlope
      categoryDefault = columnLabels;
      seriesDefault = [];
      yAxisLabelDefault = t('chart.defaultValueAxis');
  }

  const [title, setTitle] = useState(testName);
  const [xAxisLabel, setXAxisLabel] = useState(isScatter ? columnLabels[0] : '');
  const [yAxisLabel, setYAxisLabel] = useState(yAxisLabelDefault);
  const [categoryLabels, setCategoryLabels] = useState<string[]>(categoryDefault);
  const [seriesLabels, setSeriesLabels] = useState<string[]>(seriesDefault);
  const [yMinStr, setYMinStr] = useState('');
  const [yMaxStr, setYMaxStr] = useState('');
  const [xMinStr, setXMinStr] = useState('');
  const [xMaxStr, setXMaxStr] = useState('');
  const [yTickStepStr, setYTickStepStr] = useState('');

  if (!kind) return null;

  const yMin = parseOptionalNumber(yMinStr);
  const yMax = parseOptionalNumber(yMaxStr);
  const xMin = parseOptionalNumber(xMinStr);
  const xMax = parseOptionalNumber(xMaxStr);
  const yTickStepRaw = parseOptionalNumber(yTickStepStr);
  const yTickStep = yTickStepRaw !== undefined && yTickStepRaw > 0 ? yTickStepRaw : undefined;

  const handleSaveFile = async (type: 'png' | 'svg') => {
    setDownloadError(null);
    const svg = svgRef.current;
    if (!svg) return;
    const filename = `${testName.replace(/[\\/:*?"<>|]/g, '_')}_${t('chart.filenameSuffix')}.${type}`;
    try {
      if (type === 'png') {
        await downloadSvgAsPngFile(svg, filename);
      } else {
        downloadSvgAsSvgFile(svg, filename);
      }
    } catch {
      setDownloadError(t('chart.saveError'));
    }
  };

  let chart: ReactNode = null;
  switch (kind) {
    case 'box':
    case 'boxWithMu0': {
      const groups = rawData.map((values, i) => ({ label: categoryLabels[i] ?? '', values }));
      const mu0 = params.kind === 'groups' ? params.mu0 : undefined;
      chart = (
        <BoxPlot
          ref={svgRef}
          groups={groups}
          referenceLine={
            kind === 'boxWithMu0' && mu0 !== undefined ? { value: mu0, label: `μ₀ = ${mu0}` } : undefined
          }
          title={title || undefined}
          yAxisLabel={yAxisLabel || undefined}
          yMin={yMin}
          yMax={yMax}
          yTickStep={yTickStep}
        />
      );
      break;
    }
    case 'pairedSlope':
      chart = (
        <PairedSlope
          ref={svgRef}
          a={rawData[0]}
          b={rawData[1]}
          labelA={categoryLabels[0] ?? ''}
          labelB={categoryLabels[1] ?? ''}
          title={title || undefined}
          yAxisLabel={yAxisLabel || undefined}
          yMin={yMin}
          yMax={yMax}
          yTickStep={yTickStep}
        />
      );
      break;
    case 'scatter':
      chart = (
        <ScatterPlot
          ref={svgRef}
          x={rawData[0]}
          y={rawData[1]}
          xLabel={xAxisLabel}
          yLabel={yAxisLabel}
          title={title || undefined}
          xMin={xMin}
          xMax={xMax}
          yMin={yMin}
          yMax={yMax}
          yTickStep={yTickStep}
        />
      );
      break;
    case 'matrixBar': {
      const series = seriesLabels.map((label, j) => ({
        label,
        values: rawData.map((row) => row[j]),
      }));
      chart = (
        <GroupedBar
          ref={svgRef}
          categories={categoryLabels}
          series={series}
          yAxisLabel={yAxisLabel || undefined}
          title={title || undefined}
          yMin={yMin}
          yMax={yMax}
          yTickStep={yTickStep}
        />
      );
      break;
    }
    case 'goodnessBar': {
      const observed = rawData.map((row) => row[0]);
      const ratios = rawData.map((row) => row[1]);
      const ratioSum = ratios.reduce((s, v) => s + v, 0);
      const total = observed.reduce((s, v) => s + v, 0);
      const expected = ratios.map((r) => (total * r) / ratioSum);
      chart = (
        <GroupedBar
          ref={svgRef}
          categories={categoryLabels}
          series={[
            { label: seriesLabels[0] ?? t('chart.defaultObserved'), values: observed },
            { label: seriesLabels[1] ?? t('chart.defaultExpected'), values: expected },
          ]}
          yAxisLabel={yAxisLabel || undefined}
          title={title || undefined}
          yMin={yMin}
          yMax={yMax}
          yTickStep={yTickStep}
        />
      );
      break;
    }
    case 'successBar': {
      const successCounts = rawData.map((col) => col.reduce((s, v) => s + v, 0));
      chart = (
        <GroupedBar
          ref={svgRef}
          categories={categoryLabels}
          series={[{ label: seriesLabels[0] ?? t('chart.defaultSuccessSeries'), values: successCounts }]}
          yAxisLabel={yAxisLabel || undefined}
          title={title || undefined}
          yMin={yMin}
          yMax={yMax}
          yTickStep={yTickStep}
        />
      );
      break;
    }
  }

  return (
    <div>
      {chart}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => handleSaveFile('png')}
          className="rounded-lg border border-primary px-3 py-1.5 text-sm font-bold text-primary hover:bg-primary/5"
        >
          {t('chart.savePng')}
        </button>
        <button
          type="button"
          onClick={() => handleSaveFile('svg')}
          className="rounded-lg border border-border px-3 py-1.5 text-sm font-bold text-textSub hover:border-primary hover:text-primary"
        >
          {t('chart.saveSvg')}
        </button>
      </div>
      {downloadError && <p className="mt-2 text-sm text-accent">{downloadError}</p>}

      <details className="mt-4 rounded-lg border border-border">
        <summary className="cursor-pointer select-none px-3 py-2 text-sm font-bold text-textMain">
          {t('chart.settingsSummary')}
        </summary>
        <div className="border-t border-border p-3">
          <div className="mb-3">
            <label className="mb-1 block text-xs font-bold text-textSub" htmlFor="chart-title">
              {t('chart.titleLabel')}
            </label>
            <input
              id="chart-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full max-w-sm rounded border border-border px-2 py-1 text-sm text-textMain focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {isScatter ? (
            <div className="mb-3 flex flex-wrap gap-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-textSub" htmlFor="x-axis-label">
                  {t('chart.xAxisLabel')}
                </label>
                <input
                  id="x-axis-label"
                  type="text"
                  value={xAxisLabel}
                  onChange={(e) => setXAxisLabel(e.target.value)}
                  className="w-40 rounded border border-border px-2 py-1 text-sm text-textMain focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-textSub" htmlFor="y-axis-label">
                  {t('chart.yAxisLabel')}
                </label>
                <input
                  id="y-axis-label"
                  type="text"
                  value={yAxisLabel}
                  onChange={(e) => setYAxisLabel(e.target.value)}
                  className="w-40 rounded border border-border px-2 py-1 text-sm text-textMain focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          ) : (
            <div className="mb-3">
              <label className="mb-1 block text-xs font-bold text-textSub" htmlFor="y-axis-label">
                {t('chart.yAxisLabel')}
              </label>
              <input
                id="y-axis-label"
                type="text"
                value={yAxisLabel}
                onChange={(e) => setYAxisLabel(e.target.value)}
                className="w-40 rounded border border-border px-2 py-1 text-sm text-textMain focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          <LabelEditors
            title={isCategoryAxis ? t('chart.categoryNames') : t('chart.dataNames')}
            labels={categoryLabels}
            onChange={(i, v) => setCategoryLabels((prev) => prev.map((p, j) => (j === i ? v : p)))}
          />
          <LabelEditors
            title={t('chart.seriesNames')}
            labels={seriesLabels}
            onChange={(i, v) => setSeriesLabels((prev) => prev.map((p, j) => (j === i ? v : p)))}
          />

          <div className="flex flex-wrap gap-4">
            {isScatter && (
              <>
                <div>
                  <p className="mb-1 text-xs font-bold text-textSub">{t('chart.xRange')}</p>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      aria-label={t('chart.xMinAria')}
                      placeholder={t('common.auto')}
                      value={xMinStr}
                      onChange={(e) => setXMinStr(e.target.value)}
                      className="w-24 rounded border border-border px-2 py-1 text-sm text-textMain focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-textSub">〜</span>
                    <input
                      type="number"
                      aria-label={t('chart.xMaxAria')}
                      placeholder={t('common.auto')}
                      value={xMaxStr}
                      onChange={(e) => setXMaxStr(e.target.value)}
                      className="w-24 rounded border border-border px-2 py-1 text-sm text-textMain focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </>
            )}
            <div>
              <p className="mb-1 text-xs font-bold text-textSub">{t('chart.yRange')}</p>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  aria-label={t('chart.yMinAria')}
                  placeholder={t('common.auto')}
                  value={yMinStr}
                  onChange={(e) => setYMinStr(e.target.value)}
                  className="w-24 rounded border border-border px-2 py-1 text-sm text-textMain focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="text-textSub">〜</span>
                <input
                  type="number"
                  aria-label={t('chart.yMaxAria')}
                  placeholder={t('common.auto')}
                  value={yMaxStr}
                  onChange={(e) => setYMaxStr(e.target.value)}
                  className="w-24 rounded border border-border px-2 py-1 text-sm text-textMain focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-textSub" htmlFor="y-tick-step">
                {t('chart.yTickStep')}
              </label>
              <input
                id="y-tick-step"
                type="number"
                step="any"
                min="0"
                placeholder={t('chart.yTickStepPlaceholder')}
                value={yTickStepStr}
                onChange={(e) => setYTickStepStr(e.target.value)}
                className="w-32 rounded border border-border px-2 py-1 text-sm text-textMain focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="mt-1 text-xs text-textSub">{t('chart.yTickStepHint')}</p>
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}
