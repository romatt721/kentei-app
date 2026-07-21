import { Link } from 'react-router-dom';
import Disclaimer from '../components/Disclaimer';
import { tests } from '../data/tests';
import { getLocalizedTest } from '../data/tests.en';
import { useLocale } from '../i18n/LocaleContext';
import type { Category } from '../types';

function Section({ category, title }: { category: Category; title: string }) {
  const { locale, t } = useLocale();
  const list = tests.filter((tst) => tst.category === category);
  return (
    <section className="mb-8">
      <h2 className="mb-3 border-l-4 border-primary pl-3 text-xl font-bold text-textMain">
        {title}
      </h2>
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {list.map((tst) => {
          const localized = getLocalizedTest(tst, locale);
          return (
            <li key={tst.id}>
              <Link
                to={`/explain/${tst.id}`}
                className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 shadow-sm hover:border-primary"
              >
                <span>
                  <span className="font-bold text-textMain">{localized.name}</span>
                  <span className="mt-0.5 block text-xs text-textSub">{localized.description}</span>
                </span>
                {tst.phase === 2 && (
                  <span className="ml-2 shrink-0 rounded-full bg-textSub/10 px-2 py-0.5 text-xs font-bold text-textSub">
                    {t('explainList.comingSoon')}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** 画面E：検定一覧・説明トップ画面 */
export default function ExplainList() {
  const { t } = useLocale();
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-textMain">{t('explainList.title')}</h1>
      <p className="mb-6 text-sm text-textSub">{t('explainList.subtitle')}</p>
      <Section category="parametric" title={t('explainList.parametric')} />
      <Section category="nonparametric" title={t('explainList.nonparametric')} />
      <Disclaimer />
    </div>
  );
}
