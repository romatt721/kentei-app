import { useEffect, useRef } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import Disclaimer from '../components/Disclaimer';
import { useApp } from '../context/AppContext';
import { getTestById } from '../data/tests';
import { getLocalizedTest } from '../data/tests.en';
import { useLocale } from '../i18n/LocaleContext';

function SectionHeading({ children }: { children: string }) {
  return (
    <h2 className="mb-2 mt-6 border-l-4 border-primary pl-3 text-lg font-bold text-textMain">
      {children}
    </h2>
  );
}

/** 画面F：個別検定説明ページ */
export default function ExplainDetail() {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { selectTest } = useApp();
  const { locale, t } = useLocale();
  const def = testId ? getTestById(testId) : undefined;
  const contentRef = useRef<HTMLDivElement>(null);

  // MathJaxはCDNから非同期に読み込まれるため、利用可能になるまで待って数式を組版する。
  // testId・localeが変わったときは下のdivをkeyで強制的に作り直す（完全な別要素として
  // マウントし直す）ことで、前回組版した<mjx-container>が残って二重表示される問題を避ける。
  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    const el = contentRef.current;
    const tryTypeset = () => {
      if (cancelled || !el) return;
      if (window.MathJax?.typesetPromise) {
        window.MathJax.typesetPromise([el]).catch(() => {
          /* 組版失敗時はLaTeXソースがそのまま表示される */
        });
      } else if (attempts < 50) {
        attempts++;
        setTimeout(tryTypeset, 200);
      }
    };
    tryTypeset();
    return () => {
      cancelled = true;
    };
  }, [testId, locale]);

  if (!def) return <Navigate to="/explain" replace />;

  const localized = getLocalizedTest(def, locale);
  const ex = localized.explanation;

  const handleUse = () => {
    selectTest(def.id);
    navigate(def.skipParamScreen ? '/input' : '/params');
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <p className="mb-4 text-sm">
        <Link to="/explain" className="text-primary hover:underline">
          {t('explainDetail.backLink')}
        </Link>
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold text-textMain">{localized.name}</h1>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-bold ${
            def.category === 'parametric'
              ? 'bg-primary/5 text-primary'
              : 'bg-secondary/5 text-secondaryText'
          }`}
        >
          {def.category === 'parametric' ? t('explainDetail.parametric') : t('explainDetail.nonparametric')}
        </span>
        {def.phase === 2 && (
          <span className="rounded-full border border-border px-2 py-0.5 text-xs font-bold text-textSub">
            {t('explainDetail.comingSoon')}
          </span>
        )}
      </div>

      <div
        key={`${testId}-${locale}`}
        ref={contentRef}
        className="rounded-xl border border-border bg-card p-6 shadow-sm"
      >
        <SectionHeading>{t('explainDetail.overview')}</SectionHeading>
        <p className="text-sm leading-relaxed text-textMain">{ex.overview}</p>

        <SectionHeading>{t('explainDetail.purpose')}</SectionHeading>
        <p className="text-sm leading-relaxed text-textMain">{ex.purpose}</p>

        <SectionHeading>{t('explainDetail.hypothesis')}</SectionHeading>
        <dl className="text-sm leading-relaxed text-textMain">
          <div className="mb-1 flex gap-2">
            <dt className="shrink-0 font-bold">{t('explainDetail.h0')}</dt>
            <dd>{ex.h0}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="shrink-0 font-bold">{t('explainDetail.h1')}</dt>
            <dd>{ex.h1}</dd>
          </div>
        </dl>

        <SectionHeading>{t('explainDetail.assumptions')}</SectionHeading>
        <ul className="list-disc pl-5 text-sm leading-relaxed text-textMain">
          {ex.assumptions.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>

        <SectionHeading>{t('explainDetail.formula')}</SectionHeading>
        <div className="overflow-x-auto rounded-lg bg-surface p-4 text-sm text-textMain">
          {`$$${ex.formula}$$`}
        </div>
        {ex.formulaNote && (
          <p className="mt-2 text-sm leading-relaxed text-textSub">{ex.formulaNote}</p>
        )}

        <SectionHeading>{t('explainDetail.example')}</SectionHeading>
        <p className="text-sm leading-relaxed text-textMain">{ex.example}</p>

        {ex.notes && (
          <>
            <SectionHeading>{t('explainDetail.notes')}</SectionHeading>
            <p className="text-sm leading-relaxed text-textMain">{ex.notes}</p>
          </>
        )}
      </div>

      {def.phase === 1 && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={handleUse}
            className="rounded-lg bg-primary px-8 py-3 font-bold text-white hover:bg-primary/90"
          >
            {t('explainDetail.useButton')}
          </button>
        </div>
      )}

      <Disclaimer />
    </div>
  );
}
