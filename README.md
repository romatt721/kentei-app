# 有意差検定

[![verify](https://github.com/romatt721/kentei-app/actions/workflows/verify.yml/badge.svg)](https://github.com/romatt721/kentei-app/actions/workflows/verify.yml)

パラメトリック・ノンパラメトリック検定を選択してデータを入力するだけで、p値と判定が得られる統計解析Webアプリです。すべての計算はブラウザ内で完結し、データは外部に送信されません。

計算結果の検証方法（Rや数表との照合、検算スクリプトの中身）は [公開サイトの「計算結果の検証について」ページ](https://kentei-app-silk.vercel.app/verification) でも説明しています。

## 実装済みの検定（全23種）

**パラメトリック（11種）**：対応なし2標本t検定（スチューデント）／対応あり2標本t検定／一元配置分散分析（Tukey-Kramer多重比較付き）／ピアソン積率相関係数の検定／1標本t検定／ウェルチのt検定／二元配置分散分析（繰り返しあり・釣り合い型）／反復測定分散分析／等分散性のF検定／ルビーン検定／シャピロ・ウィルク検定

**ノンパラメトリック（12種）**：マン・ホイットニーU検定／ウィルコクソン符号順位検定／クラスカル・ウォリス検定／カイ二乗独立性検定／フィッシャーの正確確率検定（2×2）／スピアマン順位相関係数の検定／符号検定／フリードマン検定／カイ二乗適合度検定／マクネマー検定／コクランのQ検定／ケンドール順位相関係数の検定

## 便利機能

- **貼り付け一括入力**：Excelやスプレッドシートでコピーした範囲（タブ・カンマ・改行区切り）をデータ入力画面の先頭セルに貼り付けると、複数セルへ一括入力できます
- **効果量の表示**：p値に加えて Cohen's d・η²（偏η²）・Cramér's V・効果量r・ケンドールのW などを、Cohen (1988) の目安に基づく解釈ラベル付きで表示します
- **検定選択ガイド**：「何を調べたいか」「グループはいくつか」「対応の有無」などをいくつか答えると、状況に合った検定を提案するウィザード（`/guide`）。全23検定すべてに到達できます
- **結果グラフ**：計算結果画面に、検定の種類に応じたグラフ（箱ひげ図・散布図＋回帰直線・対応データのスロープグラフ・分割表の棒グラフ）をグレースケール配色で自動表示します。「グラフの表示設定」からタイトル・軸ラベル・軸目盛りの最小値/最大値・**Y軸目盛りの間隔（1、0.5、0.1など任意の数値）**・データ名（群名・カテゴリ名・系列名）を編集でき、PNG／SVG形式でファイル保存できます
- **APA形式コピー**：「t(8) = -1.90, p = .094」のような論文形式のレポート文をワンクリックでクリップボードにコピーできます
- **日本語／英語切り替え**：ホーム画面（検定選択画面）右上のボタンで切り替えます。以後の全画面・全23検定の解説・検定選択ガイドがその言語で表示されます。初回はブラウザの言語設定から自動判定し、以後の選択はブラウザに保存されます

## 公開・収益化に向けたページ

- `/about` サイトについて（運営者情報）
- `/faq` よくある質問
- `/contact` お問い合わせ（連絡先メールアドレスは`src/pages/ContactPage.tsx`の`CONTACT_EMAIL`で管理）
- `/privacy` プライバシーポリシー（Google AdSense等のディスプレイ広告掲載を想定した文言を含む）
- `/terms` 利用規約

いずれも日本語・英語両対応で、フッターの各ページからリンクしています。

## SEO（検索エンジン対策）

SPAはそのままだと全ルートが同じHTML（同じtitle・description）を返してしまい、検索エンジンに重複ページとみなされます。これを避けるため、ビルド時に全ページを**プリレンダリング**しています。

- `src/seo/siteConfig.ts` … サイトURL（`SITE_URL`）。**独自ドメインへ移行するときはこの1行だけを書き換える**と、canonical・OGP・sitemap.xml・robots.txt がすべて追従します
- `src/seo/routeMeta.ts` … ページごとの title / description / canonical を日本語・英語で定義。インデックス対象ルート一覧（`INDEXABLE_ROUTES`）もここが唯一の定義元
- `src/seo/useSeo.ts` … SPAのクライアント遷移・言語切り替え時に`<head>`のタグを追従させるフック
- `src/entry-server.tsx` … プリレンダリング用のエントリ（`renderToString`＋`StaticRouter`）
- `scripts/prerender.ts` … 全ルートについて `dist/<route>/index.html` を生成し、あわせて `dist/sitemap.xml` と `dist/robots.txt` を出力する

`npm run build` を実行すると、クライアントビルド → SSRビルド → プリレンダリングの順に走り、33ページ分の静的HTML（本文レンダリング済み）が生成されます。ブラウザ側は生成済みHTMLをハイドレーションします。

検定を追加・削除しても `src/data/tests.ts` を直せばsitemap.xmlとプリレンダリング対象は自動的に追従するので、**sitemap.xmlを手で更新する必要はありません**。

なお `/params` `/input` `/result` は計算の操作途中の画面で単独のコンテンツを持たないため、robots.txtでクロール対象から除外しています。

## 使い方（コマンド）

ターミナルでこのフォルダに移動してから実行します。

| コマンド | 説明 |
|---|---|
| `npm install` | 依存ライブラリをインストールする（初回のみ） |
| `npm run dev` | 開発サーバーを起動する。ブラウザで http://localhost:5173 を開く |
| `npx tsc --noEmit` | TypeScriptの型エラーをチェックする |
| `npm run build` | 本番用ファイルを `dist/` に生成する（プリレンダリングまで実行される） |
| `npm run prerender` | プリレンダリングだけを再実行する（`npm run build` の後でのみ有効） |
| `npm run verify` | 統計計算をR・数表の既知値と照合する検算を実行する |

## 技術構成

- Vite + React + TypeScript
- Tailwind CSS（配色は `tailwind.config.js` に定義）
- React Router（画面遷移）
- jStat（確率分布）・simple-statistics（記述統計）
- MathJax v3（CDN読み込み、説明ページの数式表示）

## ディレクトリ構成

```
src/
  charts/       結果画面のグラフ（箱ひげ図・散布図・スロープグラフ・棒グラフ）
  components/   共通コンポーネント（Stepper・Header・Footer・免責文）
  context/      グローバルstate（選択検定・パラメータ・入力データ・結果）
  data/         全23検定の定義と解説（tests.ts＋英語版tests.en.ts）、
                検定選択ガイドの質問ツリー（guideTree.ts＋英語版guideTree.en.ts）
  i18n/         言語切り替え（LocaleContext.tsx）とUI文言辞書（ui.ja.ts / ui.en.ts）
  pages/        画面A〜F＋クレジットページ＋検定選択ガイド（TestGuide.tsx）
  seo/          サイトURL・ページ別メタ情報・headタグ更新フック
  stats/        検定ごとの計算モジュール（検定1種につき1ファイル）、
                APA形式フォーマッタ（apa.ts）、統計結果の英訳辞書（statsLabels.ts）
  entry-server.tsx  プリレンダリング用エントリ
  types.ts      共有型定義
scripts/
  verify.ts     統計計算の検算スクリプト（英語ロケールの翻訳整合性チェックも含む）
  prerender.ts  全ページの静的HTML＋sitemap.xml＋robots.txtを生成する
public/
  favicon.svg   ファビコン
vercel.json     Vercelデプロイ設定（プリレンダリング済みHTMLを優先し、それ以外のパスは
                index.htmlへフォールバックする。末尾スラッシュなしに正規化）
```

## 免責事項

本アプリの計算結果は学習・参考目的で提供されるものであり、正確性を保証するものではありません。重要な用途では専門家の確認と専用統計ソフトウェアによる検証を行ってください。
