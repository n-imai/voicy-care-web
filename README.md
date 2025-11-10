# VoicyCare - 聴覚支援音楽プレイヤー公式サイト

VoicyCare は、聞こえにくさを感じる方のための音量増幅・音質補正に特化した音楽プレイヤーアプリです。本リポジトリはその公式ランディングページ（LP）を管理しており、アプリの価値訴求からストア審査に必要な情報提供までをワンストップでカバーします。

## 🌐 サイト構成

- `index.html` — ヒーローセクション、主な機能紹介、スクリーンショット、FAQ、ダウンロード導線を備えたメインLP
- `contact.html` — Tally 埋め込みフォームと問い合わせカテゴリの案内を含むサポートページ
- `privacy-policy.html` / `terms-of-service.html` — 法務・コンプライアンス向けの公開ドキュメント
- `en/` ディレクトリ — 英語版の LP／コンタクト／規約ページ群
- `assets/images/` — OGP、スクリーンショット、アイコン素材
- `script.js` — ナビゲーション制御、スクロールアニメーション、GA4 イベント計測、Consent Mode バナー制御

## 🛠 技術スタックと構成要素

- **HTML5 + CSS3** — セマンティックなマークアップとアクセシビリティを意識したレスポンシブデザイン
- **JavaScript (Vanilla)** — スムーススクロール、セクションハイライト、Intersection Observer を用いた演出、および同意管理
- **Structured Data (JSON-LD)** — `WebSite` / `MobileApplication` スキーマで SEO・アプリ検索最適化
- **Tally.so** — `contact.html` への問い合わせフォーム埋め込み
- **Vercel** — 静的サイトホスティングと自動デプロイ
- **GA4 + Consent Mode v2** — 計測とプライバシー対応の両立

## 🎯 LPの主な訴求ポイント

- **音量最大 200% ブースト** — ヒーローセクションとアニメーションで視覚的に表現
- **アクセシブルな UI** — 大きな文字・ボタン、落ち着いた配色で操作しやすさを訴求
- **クラウド連携とイコライザー** — 機能カードとスクリーンショットを用いて具体的な利用イメージを提供
- **多言語対応** — `lang` 指定と英語版ページにより、海外ユーザー向け導線を確保
- **信頼性の可視化** — JSON-LD、OGP、FAQ セクションでアプリの信頼性を補強

## 🚀 デプロイ

### Vercel でのデプロイ

1. **Vercel CLI を利用する場合**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```
2. **Vercel ダッシュボードから**
   - [Vercel](https://vercel.com) にログイン
   - 「New Project」→ Git リポジトリ `voicy-care-web` を選択
   - 必要に応じて環境変数（今回は無し）を確認し「Deploy」

### 自動デプロイ

- `main` ブランチへの push で本番デプロイをトリガー
- Pull Request 毎にプレビュー環境が自動生成

## 📞 お問い合わせフォーム (Tally)

- フォーム ID は `m6BDko`（`contact.html` 内の `iframe[data-tally-src]`）で管理
- 送信完了イベントは `postMessage` を介して GA4 の `generate_lead` イベントに連携
- フォーム内容を更新する場合は Tally 側で編集したうえで埋め込み URL を差し替え

## 🎨 カスタマイズガイド

- `style.css` — LP 全体のレイアウトとトークン（カラー、タイポグラフィ）を定義
- `policy-styles.css` — プライバシー・利用規約・お問い合わせページの共通スタイル
- `assets/images/screenshots/` — WebP と PNG のスクリーンショットを併用し、軽量化とフォールバックに対応
- `script.js` — 追加のインタラクションや計測イベントを実装する場合に編集

## 📱 ストア提出時に活用できる情報

- **プライバシー公開 URL** — `https://voicy-care.honeymarron.com/privacy-policy`
- **サポート連絡先** — `https://voicy-care.honeymarron.com/contact`
- **アプリ概要・スクリーンショット** — `index.html` の機能一覧と `assets/images/screenshots/`
- **同意管理の証跡** — Consent Mode v2 実装により広告・分析双方の同意状況を記録可能

## 🔗 関連リンク

- **公開サイト**: https://voicy-care.honeymarron.com/

## 📄 ライセンス

現時点では明示的なライセンスファイルを同梱していません。公開ポリシーに応じて `LICENSE` を追加してください。

---

Made with care for better listening experiences.

