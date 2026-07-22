import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Stepper from '../components/Stepper';
import { useApp } from '../context/AppContext';
import { tests } from '../data/tests';
import { getLocalizedTest } from '../data/tests.en';
import { useLocale } from '../i18n/LocaleContext';
import type { Category, TestDef } from '../types';

type Tab = 'all' | Category;

function TestCard({ test }: { test: TestDef }) {
  const navigate = useNavigate();
  const { selectTest } = useApp();
  const { locale, t } = useLocale();
  const localized = getLocalizedTest(test, locale);
  const isReady = test.phase === 1;

  const handleSelect = () => {
    selectTest(test.id);
    // フィッシャーの正確確率検定は画面Bをスキップして画面Cへ直遷移
    navigate(test.skipParamScreen ? '/input' : '/params');
  };

  return (
    <div
      className={`flex flex-col rounded-xl border border-border bg-card p-4 shadow-sm ${
        isReady ? '' : 'opacity-70'
      }`}
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-bold ${
            test.category === 'parametric'
              ? 'bg-primary/5 text-primary'
              : 'bg-secondary/5 text-secondaryText'
          }`}
        >
          {test.category === 'parametric' ? t('testSelector.tabParametric') : t('testSelector.tabNonparametric')}
        </span>
        {!isReady && (
          <span className="rounded-full border border-border px-2 py-0.5 text-xs font-bold text-textSub">
            {t('testSelector.comingSoon')}
          </span>
        )}
      </div>
      <h2 className="mb-1 font-bold text-textMain">{localized.name}</h2>
      <p className="mb-4 flex-1 text-sm text-textSub">{localized.description}</p>
      <button
        type="button"
        onClick={handleSelect}
        disabled={!isReady}
        className={`rounded-lg px-4 py-2 text-sm font-bold ${
          isReady
            ? 'bg-primary text-white hover:bg-primary/90'
            : 'cursor-not-allowed bg-border text-textSub'
        }`}
      >
        {isReady ? t('testSelector.useTest') : t('testSelector.comingSoon')}
      </button>
    </div>
  );
}

/** 画面A：検定選択画面 */
export default function TestSelector() {
  const [tab, setTab] = useState<Tab>('all');
  const { locale, setLocale, t } = useLocale();
  const filtered = tests.filter((tst) => tab === 'all' || tst.category === tab);

  const TABS: { key: Tab; label: string }[] = [
    { key: 'all', label: t('testSelector.tabAll') },
    { key: 'parametric', label: t('testSelector.tabParametric') },
    { key: 'nonparametric', label: t('testSelector.tabNonparametric') },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Stepper current={1} />
      <div className="mb-2 flex justify-end">
        <button
          type="button"
          onClick={() => setLocale(locale === 'ja' ? 'en' : 'ja')}
          className="rounded-full border border-border px-3 py-1 text-xs font-bold text-textSub hover:border-primary hover:text-primary"
          aria-label="Switch language"
        >
          {locale === 'ja' ? t('header.langButtonEn') : t('header.langButtonJa')}
        </button>
      </div>
      <h1 className="mb-2 text-center text-2xl font-bold text-textMain">
        {t('testSelector.title')}
      </h1>
      <p className="mb-4 text-center text-sm text-textSub">
        {t('testSelector.subtitlePrefix')}
        <a href="/explain" className="text-primary underline hover:no-underline">
          {t('testSelector.subtitleLink')}
        </a>
        {t('testSelector.subtitleSuffix')}
      </p>

      <div className="mb-6 flex justify-center">
        <Link
          to="/guide"
          className="flex items-center gap-2 rounded-full border border-primary bg-primary/5 px-5 py-2 text-sm font-bold text-primary hover:bg-primary/10"
        >
          {t('testSelector.guideLink')}
        </Link>
      </div>

      <div className="mb-6 flex justify-center gap-2" role="tablist" aria-label={t('testSelector.tabsAria')}>
        {TABS.map((tb) => (
          <button
            key={tb.key}
            type="button"
            role="tab"
            aria-selected={tab === tb.key}
            onClick={() => setTab(tb.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-bold ${
              tab === tb.key
                ? 'bg-primary text-white'
                : 'border border-border bg-card text-textSub hover:text-primary'
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tst) => (
          <TestCard key={tst.id} test={tst} />
        ))}
      </div>
    </div>
  );
}
