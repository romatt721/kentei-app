import { useLocale } from '../i18n/LocaleContext';

const CREDITS: { name: string; license: string; url: string }[] = [
  { name: 'React', license: 'MIT License', url: 'https://react.dev/' },
  { name: 'React DOM', license: 'MIT License', url: 'https://react.dev/' },
  { name: 'React Router', license: 'MIT License', url: 'https://reactrouter.com/' },
  { name: 'Vite', license: 'MIT License', url: 'https://vite.dev/' },
  { name: 'TypeScript', license: 'Apache License 2.0', url: 'https://www.typescriptlang.org/' },
  { name: 'Tailwind CSS', license: 'MIT License', url: 'https://tailwindcss.com/' },
  { name: 'jStat', license: 'MIT License', url: 'https://jstat.github.io/' },
  { name: 'simple-statistics', license: 'ISC License', url: 'https://simple-statistics.github.io/' },
  { name: 'MathJax', license: 'Apache License 2.0', url: 'https://www.mathjax.org/' },
  { name: 'Noto Sans JP（Google Fonts）', license: 'SIL Open Font License 1.1', url: 'https://fonts.google.com/noto/specimen/Noto+Sans+JP' },
];

/** OSSクレジット表示ページ */
export default function CreditsPage() {
  const { t } = useLocale();
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-textMain">{t('credits.title')}</h1>
      <p className="mb-6 text-sm text-textSub">{t('credits.subtitle')}</p>
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-textSub">
              <th className="px-4 py-3 font-normal">{t('credits.libName')}</th>
              <th className="px-4 py-3 font-normal">{t('credits.license')}</th>
            </tr>
          </thead>
          <tbody>
            {CREDITS.map((c) => (
              <tr key={c.name} className="border-b border-border/50">
                <td className="px-4 py-3">
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-primary hover:underline"
                  >
                    {c.name}
                  </a>
                </td>
                <td className="px-4 py-3 text-textMain">{c.license}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
