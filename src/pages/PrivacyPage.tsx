import { useLocale } from '../i18n/LocaleContext';

interface Section {
  heading: string;
  paragraphs: string[];
  links?: { label: string; url: string }[];
}

const CONTENT: Record<'ja' | 'en', { title: string; updated: string; intro: string; sections: Section[] }> = {
  ja: {
    title: 'プライバシーポリシー',
    updated: '最終更新日：2026年7月22日',
    intro:
      '本サイト運営者（以下「本サイト運営者」といいます）は、本サイト「有意差検定」（以下「本サイト」といいます）における利用者の情報の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます）を定めます。',
    sections: [
      {
        heading: '1. 検定計算機能におけるデータの取扱い',
        paragraphs: [
          '本サイトが提供する統計検定の計算機能は、利用者が入力したデータをお使いのブラウザ内でのみ処理します。入力データが本サイト運営者のサーバーその他の外部サーバーへ送信されることはありません。',
          '本サイトは、氏名・メールアドレス・電話番号など、利用者を個人として特定できる情報を取得する機能を有していません。入力したデータは、ページを閉じるか再読み込みすると失われます。',
        ],
      },
      {
        heading: '2. Cookie・ローカルストレージについて',
        paragraphs: [
          '本サイトは、表示言語（日本語／英語）の設定を保存するために、お使いのブラウザのローカルストレージ機能を使用しています。この情報は利用者の端末内にのみ保存されるものであり、本サイト運営者がこれを取得・収集することはありません。',
        ],
      },
      {
        heading: '3. 広告の配信について',
        paragraphs: [
          '本サイトは、Google AdSenseを含む第三者配信の広告サービスを利用する場合があります。',
          'これらの広告配信事業者は、利用者の興味・関心に応じた広告を表示するために、Cookie（クッキー）を使用して、本サイトおよび他のサイトへのアクセスに関する情報を収集することがあります。この情報には、氏名、住所、メールアドレス、電話番号は含まれません。',
          'Googleが広告配信に使用するCookieを無効にする場合は、Googleの広告設定ページで行うことができます。また、www.aboutads.info にアクセスいただくと、第三者配信事業者のCookieを無効にする設定や、その他の情報を確認できます。',
        ],
        links: [
          { label: 'Google 広告 – ポリシーと規約', url: 'https://policies.google.com/technologies/ads' },
          { label: 'Google 広告設定', url: 'https://adssettings.google.com/' },
          { label: 'www.aboutads.info（オプトアウト）', url: 'https://www.aboutads.info/' },
        ],
      },
      {
        heading: '4. アクセス解析ツールについて',
        paragraphs: [
          '本サイトは、アクセス状況を把握するためVercel Analyticsを利用しています。Vercel AnalyticsはCookieを使用せず、個人を特定できる情報を収集しない解析ツールであり、閲覧ページ・参照元・大まかな地域や端末の種類などを匿名化した形で集計します。この解析データは、検定計算機能で入力されたデータ（本ポリシー第1項）とは完全に独立しており、入力データ自体が解析ツールへ送信されることはありません。本サイトは、本ポリシーの制定時点においてGoogle Analyticsは使用していません。今後、Google Analytics等の追加のアクセス解析ツールを導入する場合には、本ポリシーを改定し、本ページにてお知らせします。',
        ],
      },
      {
        heading: '5. 計算結果に関する免責事項',
        paragraphs: [
          '本サイトの計算結果は学習・参考目的で提供されるものであり、その正確性・完全性を保証するものではありません。研究発表・論文投稿・医療上の意思決定など重要な用途では、必ず専門家の確認と専用統計ソフトウェアによる検証を行ってください。本サイトの利用により生じたいかなる損害についても、本サイト運営者は責任を負いません。',
        ],
      },
      {
        heading: '6. 本ポリシーの変更について',
        paragraphs: [
          '本サイト運営者は、法令の変更や運営方針の変更等により、本ポリシーの内容を予告なく変更することがあります。変更後のプライバシーポリシーは、本ページに掲載した時点から効力を生じるものとします。',
        ],
      },
      {
        heading: '7. お問い合わせ',
        paragraphs: ['本ポリシーに関するお問い合わせは、お問い合わせページよりご連絡ください。'],
      },
    ],
  },
  en: {
    title: 'Privacy Policy',
    updated: 'Last updated: July 22, 2026',
    intro:
      'The operator of this site (the "Site Operator") has established the following Privacy Policy (this "Policy") regarding the handling of user information on "Significance Test" (this "Site").',
    sections: [
      {
        heading: '1. Handling of Data in the Statistical Test Calculators',
        paragraphs: [
          'The statistical test calculators provided on this Site process the data you enter entirely within your own browser. Your input data is never transmitted to the Site Operator\'s servers or any other external server.',
          'This Site has no functionality to collect personally identifiable information such as your name, email address, or phone number. Any data you enter is lost when you close or reload the page.',
        ],
      },
      {
        heading: '2. Cookies and Local Storage',
        paragraphs: [
          "This Site uses your browser's local storage feature to remember your display language preference (Japanese or English). This information is stored only on your own device, and the Site Operator does not collect or access it.",
        ],
      },
      {
        heading: '3. Advertising',
        paragraphs: [
          'This Site may use third-party advertising services, including Google AdSense.',
          'These advertising vendors may use cookies to serve ads based on your prior visits to this Site and other sites, in order to show ads relevant to your interests. This information does not include your name, address, email address, or telephone number.',
          "You can opt out of personalized advertising by visiting Google's Ads Settings, or visit www.aboutads.info to learn about opting out of third-party vendors' use of cookies for personalized advertising.",
        ],
        links: [
          { label: 'Google Ads – Policies & Terms', url: 'https://policies.google.com/technologies/ads' },
          { label: 'Google Ads Settings', url: 'https://adssettings.google.com/' },
          { label: 'www.aboutads.info (opt-out)', url: 'https://www.aboutads.info/' },
        ],
      },
      {
        heading: '4. Analytics Tools',
        paragraphs: [
          'This Site uses Vercel Analytics to understand traffic to the Site. Vercel Analytics does not use cookies and does not collect personally identifiable information; it aggregates anonymized data such as pages visited, referrers, and coarse geographic/device information. This analytics data is entirely separate from the data you enter into the test-calculation feature (see Section 1) — your input data is never sent to the analytics tool. As of the date of this Policy, this Site does not use Google Analytics. If additional analytics tools such as Google Analytics are introduced in the future, this Policy will be revised and the update will be posted on this page.',
        ],
      },
      {
        heading: '5. Disclaimer Regarding Results',
        paragraphs: [
          'The results produced by this Site are provided for learning and reference purposes only, and their accuracy and completeness are not guaranteed. For research publications, academic papers, medical decision-making, or any other important use, please verify results with a qualified expert and dedicated statistical software. The Site Operator accepts no liability for any damages arising from the use of this Site.',
        ],
      },
      {
        heading: '6. Changes to This Policy',
        paragraphs: [
          'The Site Operator may change this Policy without notice due to changes in applicable law or operating policy. Any revised Policy takes effect from the time it is posted on this page.',
        ],
      },
      {
        heading: '7. Contact',
        paragraphs: ['For questions about this Policy, please get in touch via the Contact page.'],
      },
    ],
  },
};

/** プライバシーポリシーページ */
export default function PrivacyPage() {
  const { locale } = useLocale();
  const content = CONTENT[locale];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold text-textMain">{content.title}</h1>
      <p className="mb-6 text-xs text-textSub">{content.updated}</p>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <p className="mb-6 text-sm leading-relaxed text-textMain">{content.intro}</p>

        {content.sections.map((section) => (
          <div key={section.heading} className="mb-6 last:mb-0">
            <h2 className="mb-2 border-l-4 border-primary pl-3 text-base font-bold text-textMain">
              {section.heading}
            </h2>
            {section.paragraphs.map((p) => (
              <p key={p} className="mb-2 text-sm leading-relaxed text-textMain last:mb-0">
                {p}
              </p>
            ))}
            {section.links && (
              <ul className="mt-2 list-disc pl-5 text-sm">
                {section.links.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
