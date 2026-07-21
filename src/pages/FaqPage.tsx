import { Link } from 'react-router-dom';
import { useLocale } from '../i18n/LocaleContext';

interface FaqItem {
  q: string;
  a: string;
}

const CONTENT: Record<'ja' | 'en', { title: string; subtitle: string; items: FaqItem[] }> = {
  ja: {
    title: 'よくある質問',
    subtitle: '有意差検定についてよく寄せられるご質問をまとめました。',
    items: [
      {
        q: 'このサイトは無料で使えますか？',
        a: 'はい、完全に無料でご利用いただけます。会員登録やログインも不要です。',
      },
      {
        q: '入力したデータはサーバーに保存されますか？',
        a: 'いいえ。すべての計算はお使いのブラウザ内で完結しており、入力データが外部のサーバーに送信されることはありません。ページを閉じたり再読み込みしたりすると、入力内容は失われます。',
      },
      {
        q: 'どんな検定に対応していますか？',
        a: '対応なし・対応あり2標本t検定、一元配置分散分析、ピアソン相関、マン・ホイットニーU検定、カイ二乗検定など、パラメトリック11種・ノンパラメトリック12種の合計23種類の検定に対応しています。詳しくは検定一覧・説明ページをご覧ください。',
      },
      {
        q: 'どの検定を使えばよいかわかりません。',
        a: '「検定選択ガイド」で、データの形やいくつかの質問に答えるだけで適切な検定を提案する機能をご用意しています。ホーム画面からアクセスできます。',
      },
      {
        q: '計算結果は研究発表や論文にそのまま使えますか？',
        a: '本サイトの計算結果は学習・参考目的で提供するものであり、正確性・完全性を保証するものではありません。研究発表や論文投稿、医療上の意思決定など重要な用途では、必ず専門家の確認と専用の統計ソフトウェア（R、SPSS等）による検証を行ってください。',
      },
      {
        q: 'スマートフォンでも使えますか？',
        a: '基本的な操作は可能ですが、レスポンシブ対応はベストエフォートであり、スマートフォン向けの専用最適化は行っておりません。PC・タブレットでのご利用を推奨します。',
      },
      {
        q: '英語表示はできますか？',
        a: 'はい。ホーム画面（検定選択画面）右上のボタンから日本語⇔英語を切り替えられます。切り替えた言語は以後のすべての画面に適用されます。',
      },
      {
        q: '結果をグラフや論文形式でコピーできますか？',
        a: 'はい。結果画面では検定の種類に応じたグラフをPNG/SVG形式で保存できるほか、「t(8) = -1.90, p = .094」のようなAPA形式のレポート文をワンクリックでコピーできます。',
      },
      {
        q: '広告は表示されますか？',
        a: '本サイトはGoogle等の第三者配信事業者による広告を表示する場合があります。広告配信に伴うCookieの利用等について詳しくは、プライバシーポリシーをご覧ください。',
      },
      {
        q: '不具合の報告や機能のご要望はどこに連絡すればよいですか？',
        a: 'お問い合わせページからご連絡ください。',
      },
    ],
  },
  en: {
    title: 'Frequently Asked Questions',
    subtitle: 'Answers to common questions about this significance-testing tool.',
    items: [
      {
        q: 'Is this site free to use?',
        a: 'Yes, it is completely free. No account or login is required.',
      },
      {
        q: 'Is my input data saved on a server?',
        a: 'No. All calculations run entirely in your browser, and your input data is never sent to an external server. Your input is lost if you close or reload the page.',
      },
      {
        q: 'Which tests are supported?',
        a: 'The site supports 23 tests in total — 11 parametric (independent/paired t-test, one-way ANOVA, Pearson correlation, etc.) and 12 nonparametric (Mann–Whitney U, chi-square tests, etc.). See the Test List & Guide page for details.',
      },
      {
        q: "I'm not sure which test to use.",
        a: 'Use the "Test Selection Wizard," which suggests an appropriate test after you answer a few questions about your data. It is accessible from the home screen.',
      },
      {
        q: 'Can I use the results directly in a research paper?',
        a: 'The results on this site are provided for learning and reference purposes only, and their accuracy and completeness are not guaranteed. For research publications, academic papers, medical decision-making, or any other important use, please verify results with a qualified expert and dedicated statistical software (such as R or SPSS).',
      },
      {
        q: 'Does it work on smartphones?',
        a: 'Basic operation is possible, but responsive support is best-effort and the site is not specifically optimized for smartphones. We recommend using a PC or tablet.',
      },
      {
        q: 'Is an English version available?',
        a: 'Yes. Use the button in the top-right of the home screen (test selection screen) to switch between Japanese and English. Your choice applies to every screen afterward.',
      },
      {
        q: 'Can I export the results as a chart or in paper format?',
        a: 'Yes. The result screen lets you save a chart appropriate to the test as a PNG or SVG file, and copy an APA-style report line such as "t(8) = -1.90, p = .094" with one click.',
      },
      {
        q: 'Are ads shown on this site?',
        a: 'This site may display ads served by third-party vendors, including Google. See the Privacy Policy for details on the use of cookies for advertising.',
      },
      {
        q: 'Where can I report a bug or request a feature?',
        a: 'Please get in touch via the Contact page.',
      },
    ],
  },
};

/** FAQページ */
export default function FaqPage() {
  const { locale, t } = useLocale();
  const content = CONTENT[locale];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-textMain">{content.title}</h1>
      <p className="mb-6 text-sm text-textSub">{content.subtitle}</p>

      <div className="flex flex-col gap-3">
        {content.items.map((item) => (
          <div key={item.q} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="mb-2 font-bold text-textMain">Q. {item.q}</p>
            <p className="text-sm leading-relaxed text-textSub">A. {item.a}</p>
          </div>
        ))}
      </div>

      <p className="mt-6 text-sm">
        <Link to="/contact" className="font-bold text-primary hover:underline">
          {t('footer.contact')} →
        </Link>
      </p>
    </div>
  );
}
