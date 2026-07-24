import { Link } from 'react-router-dom';
import { useLocale } from '../i18n/LocaleContext';

const GITHUB_URL = 'https://github.com/romatt721/kentei-app';

interface Section {
  heading: string;
  paragraphs: string[];
}

const CONTENT: Record<
  'ja' | 'en',
  {
    title: string;
    intro: string;
    sections: Section[];
    operatorLabel: string;
    operatorRows: { label: string; value: string }[];
    verificationLink: string;
    githubLink: string;
    contactLink: string;
  }
> = {
  ja: {
    title: 'サイトについて',
    intro:
      '「有意差検定」は、統計的仮説検定をブラウザ上で手軽に実行できる無料のウェブツールです。研究・学習の場面で「この差は統計的に意味があるのか？」を確かめたいとき、専用ソフトウェアを用意しなくても、データを貼り付けるだけで検定結果と効果量、APA形式のレポート文まで得られることを目指して開発しました。',
    sections: [
      {
        heading: '本サイトの目的',
        paragraphs: [
          '統計検定を「正しく・手軽に」使えるようにすることが本サイトの目的です。パラメトリック11種・ノンパラメトリック12種の合計23種類の検定に対応し、各検定には使いどころ・前提条件・結果の読み方を説明する解説ページを用意しています。どの検定を使えばよいか迷った場合のための検定選択ガイドも提供しています。',
          'すべての計算は利用者のブラウザ内で完結し、入力データが外部のサーバーに送信されることはありません。',
        ],
      },
      {
        heading: '信頼性への取り組み',
        paragraphs: [
          '統計計算の正確さは本サイトの生命線です。全検定の計算結果を統計ソフトウェアRおよび既知の数表と照合する自動検算を整備し、ソースコードもGitHubで全体公開しています。検算の方法と既知の制限事項は「計算結果の検証について」のページで公開しています。',
        ],
      },
      {
        heading: '運営形態',
        paragraphs: [
          '本サイトは個人が運営する非営利目的中心のサービスです。運営費用（ドメイン・インフラ等）の補填のため、Google等の第三者配信事業者による広告を掲載する場合があります。広告に伴うCookieの利用等についてはプライバシーポリシーをご覧ください。',
        ],
      },
    ],
    operatorLabel: '運営者情報',
    operatorRows: [
      { label: 'サイト名', value: '有意差検定' },
      { label: '運営者', value: '本サイト運営者（個人）' },
      { label: '公開開始', value: '2026年7月' },
      { label: '連絡先', value: 'お問い合わせページをご覧ください' },
    ],
    verificationLink: '計算結果の検証について',
    githubLink: 'GitHubでソースコードを見る',
    contactLink: 'お問い合わせ',
  },
  en: {
    title: 'About This Site',
    intro:
      '"Significance Test" is a free web tool for running statistical hypothesis tests right in your browser. When you want to know whether a difference is statistically meaningful — for research or study — you can simply paste your data and get the test result, effect size, and an APA-style report line, with no dedicated software required.',
    sections: [
      {
        heading: 'Purpose',
        paragraphs: [
          'The goal of this site is to make statistical tests easy to use — and easy to use correctly. It supports 23 tests in total (11 parametric and 12 nonparametric), each with an explanation page covering when to use it, its assumptions, and how to read the results. A test selection wizard is also available for when you are unsure which test to apply.',
          'All calculations run entirely in your browser; your input data is never sent to an external server.',
        ],
      },
      {
        heading: 'Commitment to Accuracy',
        paragraphs: [
          'The accuracy of the statistical calculations is the foundation of this site. Every test is checked by an automated verification suite against the statistical software R and published reference tables, and the full source code is publicly available on GitHub. The verification methodology and known limitations are documented on the "How Accuracy Is Verified" page.',
        ],
      },
      {
        heading: 'Operation',
        paragraphs: [
          'This site is operated by an individual, primarily on a non-commercial basis. To help cover operating costs (domain, infrastructure, etc.), it may display ads served by third-party vendors such as Google. See the Privacy Policy for details on the use of cookies for advertising.',
        ],
      },
    ],
    operatorLabel: 'Operator Information',
    operatorRows: [
      { label: 'Site name', value: 'Significance Test' },
      { label: 'Operator', value: 'Site operator (individual)' },
      { label: 'Launched', value: 'July 2026' },
      { label: 'Contact', value: 'See the Contact page' },
    ],
    verificationLink: 'How Accuracy Is Verified',
    githubLink: 'View the source code on GitHub',
    contactLink: 'Contact',
  },
};

/** サイトについて（運営者情報）ページ */
export default function AboutPage() {
  const { locale } = useLocale();
  const content = CONTENT[locale];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold text-textMain">{content.title}</h1>
      <p className="mb-6 text-sm leading-relaxed text-textMain">{content.intro}</p>

      <div className="flex flex-col gap-4">
        {content.sections.map((section) => (
          <section key={section.heading} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-2 font-bold text-textMain">{section.heading}</h2>
            {section.paragraphs.map((p) => (
              <p key={p} className="mb-2 text-sm leading-relaxed text-textSub last:mb-0">
                {p}
              </p>
            ))}
          </section>
        ))}

        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-3 font-bold text-textMain">{content.operatorLabel}</h2>
          <dl className="text-sm">
            {content.operatorRows.map((row) => (
              <div key={row.label} className="mb-2 flex flex-col last:mb-0 sm:flex-row">
                <dt className="w-32 shrink-0 font-bold text-textSub">{row.label}</dt>
                <dd className="text-textMain">{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <ul className="mt-6 flex flex-col gap-2 text-sm">
        <li>
          <Link to="/verification" className="font-bold text-primary hover:underline">
            {content.verificationLink} →
          </Link>
        </li>
        <li>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-primary hover:underline"
          >
            {content.githubLink} →
          </a>
        </li>
        <li>
          <Link to="/contact" className="font-bold text-primary hover:underline">
            {content.contactLink} →
          </Link>
        </li>
      </ul>
    </div>
  );
}
