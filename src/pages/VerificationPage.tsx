import { Link } from 'react-router-dom';
import { useLocale } from '../i18n/LocaleContext';

const CONTENT = {
  ja: {
    title: '計算結果の検証について',
    subtitle:
      '本サイトの統計計算がどのように検証されているか、そして計算コード自体をどこで確認できるかをまとめています。',
    sections: [
      {
        heading: '1. ソースコードはすべて公開されています',
        body: 'すべての検定の計算ロジックは、GitHub上のリポジトリで誰でも閲覧できます。統計に詳しい方は、実際に使われている数式やアルゴリズムをコードレベルで確認いただけます。',
        link: { label: 'GitHubでソースコードを見る', url: 'https://github.com/romatt721/kentei-app' },
      },
      {
        heading: '2. 既知の値との自動照合（検算）',
        body: '全23種類の検定について、統計解析ソフトR、または統計学の教科書・数表に掲載されている既知の計算例と結果を突き合わせる検算スクリプトを用意しています。コードを変更するたびにこの検算を実行し、計算結果が既知の値と一致することを確認しています。',
        detail: '現在、99項目の検算（統計量・p値・APA形式のレポート文・多言語表示の整合性を含む）がすべて一致しています。',
        link: {
          label: '検算スクリプト（scripts/verify.ts）を見る',
          url: 'https://github.com/romatt721/kentei-app/blob/main/scripts/verify.ts',
        },
      },
      {
        heading: '3. 継続的な検算（CI）',
        body: 'コードに変更を加えるたびに、GitHub Actions上で自動的に検算スクリプトが実行されます。検算がすべて通過していることは、リポジトリのバッジで常に確認できます。将来コードを修正した際に、意図せず計算結果がずれてしまう事故を防ぐ仕組みです。',
      },
      {
        heading: '4. それでも確認いただきたいこと',
        body: '本サイトは学習・参考目的のツールであり、正確性を保証するものではありません。研究発表や論文投稿、医療・実務上の重要な意思決定には、必ず専門家の確認や、R・SPSSなどの専用統計ソフトウェアによる並行検証を行ってください。',
      },
    ],
  },
  en: {
    title: 'How Calculation Accuracy Is Verified',
    subtitle:
      'This page explains how the statistical calculations on this site are verified, and where you can inspect the calculation source code itself.',
    sections: [
      {
        heading: '1. The source code is fully open',
        body: 'The calculation logic for every test is publicly available on GitHub. If you have a statistics background, you can inspect the exact formulas and algorithms used, at the code level.',
        link: { label: 'View the source code on GitHub', url: 'https://github.com/romatt721/kentei-app' },
      },
      {
        heading: '2. Automated cross-checking against known values',
        body: 'For all 23 tests, we maintain a verification script that compares this app’s output against known results computed with the R statistical software, or published in statistics textbooks and reference tables. This script runs every time the code changes, to confirm that results still match the known values.',
        detail: 'Currently, all 99 checks pass — covering test statistics, p-values, APA-style report strings, and consistency of the Japanese/English translations.',
        link: {
          label: 'View the verification script (scripts/verify.ts)',
          url: 'https://github.com/romatt721/kentei-app/blob/main/scripts/verify.ts',
        },
      },
      {
        heading: '3. Continuous verification (CI)',
        body: 'Every code change automatically triggers the verification script via GitHub Actions. Whether all checks currently pass is visible at a glance via the badge on the repository, which helps prevent silent regressions when the code is modified in the future.',
      },
      {
        heading: '4. What you should still do',
        body: 'This site is provided for learning and reference purposes, and accuracy is not guaranteed. For research publications, academic papers, or important medical or professional decisions, please always verify results with a qualified expert and dedicated statistical software such as R or SPSS.',
      },
    ],
  },
};

/** 計算結果の検証についてのページ */
export default function VerificationPage() {
  const { locale, t } = useLocale();
  const content = CONTENT[locale];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-textMain">{content.title}</h1>
      <p className="mb-6 text-sm text-textSub">{content.subtitle}</p>

      <div className="flex flex-col gap-4">
        {content.sections.map((section) => (
          <div key={section.heading} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-2 font-bold text-textMain">{section.heading}</h2>
            <p className="text-sm leading-relaxed text-textSub">{section.body}</p>
            {'detail' in section && section.detail && (
              <p className="mt-2 text-sm font-bold leading-relaxed text-textMain">{section.detail}</p>
            )}
            {'link' in section && section.link && (
              <a
                href={section.link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm font-bold text-primary hover:underline"
              >
                {section.link.label} ↗
              </a>
            )}
          </div>
        ))}
      </div>

      <p className="mt-6 text-sm">
        <Link to="/faq" className="font-bold text-primary hover:underline">
          {t('footer.faq')} →
        </Link>
      </p>
    </div>
  );
}
