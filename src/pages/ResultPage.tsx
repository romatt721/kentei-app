import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import DataChart from '../charts/DataChart';
import Disclaimer from '../components/Disclaimer';
import Stepper from '../components/Stepper';
import { useApp } from '../context/AppContext';
import { getTestById } from '../data/tests';
import { getLocalizedTest } from '../data/tests.en';
import { useLocale } from '../i18n/LocaleContext';
import type { Locale } from '../i18n/LocaleContext';
import { getColumnLabels } from '../stats';
import { formatApa } from '../stats/apa';
import { translateStatsText } from '../stats/statsLabels';
import type { TestResult } from '../types';

function formatP(p: number): string {
  if (p < 0.0001) return 'p < 0.0001';
  return `p = ${p.toFixed(4)}`;
}

function formatStat(v: number): string {
  if (!Number.isFinite(v)) return '∞';
  return Math.abs(v) >= 10000 ? v.toExponential(4) : v.toFixed(4);
}

/** α水準ごとの判定表示 */
function Judgment({
  alpha,
  p,
  isCorrelation,
}: {
  alpha: number;
  p: number;
  isCorrelation: boolean;
}) {
  const { t } = useLocale();
  const significant = p < alpha;
  return (
    <div
      className={`flex-1 rounded-lg border p-4 ${
        significant ? 'border-accent bg-accent/5' : 'border-border bg-surface'
      }`}
    >
      <p className="text-sm text-textSub">{t('result.alphaLabel', { alpha })}</p>
      <p
        className={`mt-1 text-lg font-bold ${
          significant ? 'text-accent' : 'text-textSub'
        }`}
      >
        {significant
          ? t(isCorrelation ? 'result.significantYes_corr' : 'result.significantYes_diff')
          : t(isCorrelation ? 'result.significantNo_corr' : 'result.significantNo_diff')}
      </p>
      <p className="mt-1 text-xs text-textSub">
        {t(significant ? 'result.rejectYes' : 'result.rejectNo', { alpha })}
      </p>
    </div>
  );
}

/** 結果をAPA形式でコピーするボタン */
function CopyApaButton({ result, locale }: { result: TestResult; locale: Locale }) {
  const { t } = useLocale();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatApa(result, locale));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // クリップボードAPIが使えない環境では何もしない
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-lg border border-primary px-3 py-1.5 text-sm font-bold text-primary hover:bg-primary/5"
    >
      {copied ? t('result.copyApaDone') : t('result.copyApa')}
    </button>
  );
}

/** 画面D：結果表示画面 */
export default function ResultPage() {
  const navigate = useNavigate();
  const { result, params, reset } = useApp();
  const { locale, t } = useLocale();

  if (!result) return <Navigate to="/" replace />;

  const defRaw = getTestById(result.testId);
  const def = defRaw ? getLocalizedTest(defRaw, locale) : undefined;
  const isCorrelation = !!result.correlation;
  const tr = (s: string) => translateStatsText(s, locale);

  const handleRestart = () => {
    reset();
    navigate('/');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Stepper current={4} />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-textMain">{t('result.title')}</h1>
        <CopyApaButton result={result} locale={locale} />
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <p className="mb-4 text-sm font-bold text-primary">{tr(result.method)}</p>

        {result.anovaRows ? (
          // 二元配置分散分析：要因ごとの分散分析表を表示
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-textSub">
                  <th className="px-3 py-2 font-normal">{t('result.anovaSource')}</th>
                  <th className="px-3 py-2 font-normal">{t('result.anovaDf')}</th>
                  <th className="px-3 py-2 font-normal">{t('result.anovaF')}</th>
                  <th className="px-3 py-2 font-normal">{t('result.anovaP')}</th>
                  <th className="px-3 py-2 font-normal">{t('result.anovaJudge05')}</th>
                  <th className="px-3 py-2 font-normal">{t('result.anovaJudge01')}</th>
                </tr>
              </thead>
              <tbody>
                {result.anovaRows.map((row) => (
                  <tr key={row.source} className="border-b border-border/50">
                    <td className="px-3 py-2 font-bold text-textMain">{tr(row.source)}</td>
                    <td className="px-3 py-2 text-textMain">{row.df}</td>
                    <td className="px-3 py-2 text-textMain">{formatStat(row.f)}</td>
                    <td className="px-3 py-2 text-textMain">{formatP(row.p)}</td>
                    {[0.05, 0.01].map((alpha) => (
                      <td
                        key={alpha}
                        className={`px-3 py-2 font-bold ${
                          row.p < alpha ? 'text-accent' : 'text-textSub'
                        }`}
                      >
                        {row.p < alpha ? t('result.significant') : t('result.notSignificant')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-wrap gap-6">
              <div>
                <p className="text-sm text-textSub">{tr(result.statLabel)}</p>
                <p className="text-3xl font-bold text-textMain">
                  {formatStat(result.statValue)}
                </p>
              </div>
              {result.df && (
                <div>
                  <p className="text-sm text-textSub">{t('result.statLabel_df')}</p>
                  <p className="text-3xl font-bold text-textMain">{result.df}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-textSub">{t('result.pValueBoth')}</p>
                <p className="text-3xl font-bold text-primary">
                  {formatP(result.pValue)}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Judgment alpha={0.05} p={result.pValue} isCorrelation={isCorrelation} />
              <Judgment alpha={0.01} p={result.pValue} isCorrelation={isCorrelation} />
            </div>
          </>
        )}

        {result.approxNote && (
          <p className="mt-4 text-xs text-textSub">※ {tr(result.approxNote)}</p>
        )}
        {result.warnings?.map((w) => (
          <p key={w} className="mt-2 text-sm font-bold text-accent" role="alert">
            ⚠ {tr(w)}
          </p>
        ))}
      </div>

      {result.effectSizes && result.effectSizes.length > 0 && (
        <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-bold text-textMain">{t('result.effectSizeTitle')}</h2>
          <div className="flex flex-col gap-3">
            {result.effectSizes.map((es) => (
              <div key={es.label} className="flex flex-wrap items-center gap-4">
                <p className="text-sm text-textSub">{tr(es.label)}</p>
                <p className="text-2xl font-bold text-textMain">
                  {formatStat(es.value)}
                </p>
                {es.interpretation && (
                  <span className="rounded-full bg-secondary/10 px-3 py-1 text-sm font-bold text-secondary">
                    {tr(es.interpretation)}
                  </span>
                )}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-textSub">{t('result.effectSizeNote')}</p>
        </div>
      )}

      {result.correlation && (
        <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-bold text-textMain">{t('result.correlationTitle')}</h2>
          <div className="flex flex-wrap items-center gap-6">
            <p className="text-3xl font-bold text-textMain">
              {result.correlation.r.toFixed(4)}
            </p>
            <span className="rounded-full bg-primary/10 px-4 py-1 font-bold text-primary">
              {tr(result.correlation.label)}
            </span>
          </div>
          <p className="mt-2 text-xs text-textSub">{t('result.correlationStrengthNote')}</p>
        </div>
      )}

      {result.tukey && (
        <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-bold text-textMain">{t('result.tukeyTitle')}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-textSub">
                  <th className="px-3 py-2 font-normal">{t('result.tukeyPair')}</th>
                  <th className="px-3 py-2 font-normal">{t('result.tukeyDiff')}</th>
                  <th className="px-3 py-2 font-normal">{t('result.tukeyQ')}</th>
                  <th className="px-3 py-2 font-normal">{t('result.tukeyP')}</th>
                  <th className="px-3 py-2 font-normal">{t('result.tukeyJudge')}</th>
                </tr>
              </thead>
              <tbody>
                {result.tukey.map((row) => (
                  <tr key={row.pair} className="border-b border-border/50">
                    <td className="px-3 py-2 font-bold text-textMain">{tr(row.pair)}</td>
                    <td className="px-3 py-2 text-textMain">{row.diff.toFixed(4)}</td>
                    <td className="px-3 py-2 text-textMain">{row.q.toFixed(4)}</td>
                    <td className="px-3 py-2 text-textMain">{formatP(row.p)}</td>
                    <td
                      className={`px-3 py-2 font-bold ${
                        row.p < 0.05 ? 'text-accent' : 'text-textSub'
                      }`}
                    >
                      {row.p < 0.05 ? t('result.significant') : t('result.notSignificant')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {def && params && result.rawData && (
        <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-bold text-textMain">{t('result.chartTitle')}</h2>
          <DataChart
            def={defRaw!}
            params={params}
            rawData={result.rawData}
            columnLabels={getColumnLabels(defRaw!, params, locale)}
            locale={locale}
            testName={def.name}
          />
        </div>
      )}

      {result.summaries && (
        <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-bold text-textMain">{t('result.summaryTitle')}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-textSub">
                  <th className="px-3 py-2 font-normal">{t('result.summaryGroup')}</th>
                  <th className="px-3 py-2 font-normal">{t('result.summaryN')}</th>
                  <th className="px-3 py-2 font-normal">{t('result.summaryMean')}</th>
                  <th className="px-3 py-2 font-normal">{t('result.summaryMedian')}</th>
                  <th className="px-3 py-2 font-normal">{t('result.summarySd')}</th>
                </tr>
              </thead>
              <tbody>
                {result.summaries.map((s) => (
                  <tr key={s.label} className="border-b border-border/50">
                    <td className="px-3 py-2 font-bold text-textMain">{tr(s.label)}</td>
                    <td className="px-3 py-2 text-textMain">{s.n}</td>
                    <td className="px-3 py-2 text-textMain">{s.mean.toFixed(4)}</td>
                    <td className="px-3 py-2 text-textMain">{s.median.toFixed(4)}</td>
                    <td className="px-3 py-2 text-textMain">
                      {s.sd === null ? '—' : s.sd.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {result.extraStats && result.extraStats.length > 0 && (
        <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-bold text-textMain">{t('result.extraStatsTitle')}</h2>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
            {result.extraStats.map((e) => (
              <div key={e.label} className="flex justify-between border-b border-border/50 py-1">
                <dt className="text-textSub">{tr(e.label)}</dt>
                <dd className="font-bold text-textMain">{e.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {def && (
        <p className="mt-6">
          <Link
            to={`/explain/${def.id}`}
            className="font-bold text-primary hover:underline"
          >
            {t('result.explainLink')}
          </Link>
        </p>
      )}

      <Disclaimer />

      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={handleRestart}
          className="rounded-lg bg-primary px-8 py-3 font-bold text-white hover:bg-primary/90"
        >
          {t('common.restart')}
        </button>
      </div>
    </div>
  );
}
