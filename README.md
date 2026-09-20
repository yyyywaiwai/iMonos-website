# iMons website

Astro + React + Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com), deployed to
Cloudflare Pages.

## 開発

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/ へ静的出力
npm run preview  # ビルド結果を確認
npm run check    # 型チェック
```

## Cloudflare Pages の設定

素の HTML を配信していた構成から移行したため、Pages 側の設定を変更する必要があります。

| 項目 | 値 |
| --- | --- |
| Build command | `npm run build` |
| Build output directory | `dist` |

## 構成

```
src/
  pages/            ルーティング（ファイル名がそのまま URL になる）
  layouts/          BaseLayout（<head>・meta）と InstallLayout
  components/ui/    shadcn/ui コンポーネント
  components/       サイト固有のコンポーネント
  scripts/          クライアント側の挙動（スクロール演出・Story の読書進捗）
  styles/global.css デザイントークンと長文用タイポグラフィ
public/             そのまま配信される静的ファイル（画像・_headers・_redirects）
```

### URL について

`astro.config.mjs` で `build.format: "file"` を指定し、移行前の `.html`
付き URL をそのまま維持しています。Story ページだけは
`/story/index.html` から `/story.html` に変わったため、`public/_redirects`
で 301 リダイレクトしています。

### コンポーネントの追加

```bash
npx shadcn@latest add <component>
```

`.astro` から shadcn コンポーネントを使う際の注意点:

- `Button` / `Card` / `Badge` / `Separator` のような表示専用のものは
  `client:*` なしで使えます。静的 HTML になり JS は配信されません。
- `asChild` は使えません。Astro は子要素を `<astro-slot>` の文字列として渡すため、
  Radix の `Slot` がマージ先の要素を見つけられません。リンクをボタン風にしたい場合は
  `cn(buttonVariants(), ...)` を `<a>` の `class` に渡してください。
- Accordion のように内部で context を使うものは、ツリー全体を 1 つの `.tsx`
  にまとめて `client:visible` などを付けた 1 つの island にする必要があります
  （`src/components/FaqAccordion.tsx` が例）。
