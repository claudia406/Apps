# Shiori's World Travel

> Simple to record. Beautiful to browse. Fun to revisit.
> 記録は簡単に。眺めるのは楽しく。何度でも開きたくなる。

iPhone専用・完全ローカル保存の個人旅行アーカイブPWA。旅行管理アプリでもSNSでもなく、「自分がこれまで世界のどこへ行ったのかを、写真中心で美しく振り返る」ためのアプリです。

## 概要

- 訪問した国と写真を記録するだけのシンプルな旅行アーカイブ
- 写真はすべて端末内（IndexedDB）に保存。外部サーバーへのアップロードは一切なし
- カラフルなイラスト調の世界地図をホーム画面に、訪問国へピンを表示
- Discover機能は、国の紹介写真取得時のみオンラインの公開データ（Wikipedia）にアクセス。写真本体を含むユーザーデータは常にローカルのまま

## 主な機能

### Map（ホーム）
- イラスト調の世界地図（横スクロールでズーム表示、初期表示は日本付近を中心化）
- 訪問済みの国に1つずつピンを表示し、最初に訪れた年月を直接表示
- ピンをタップすると国のカバー写真＋国名のボトムカードを表示
- 「＋ 旅行を追加」から国・エリア・年月・タイトル・メモ・写真をまとめて記録（写真0枚でも保存可）

### Countries（国一覧）
- 初めて訪問した順に、カバー写真付きのカードで一覧表示
- 国ページから、その国のTravel List（訪問ごとのカード）を閲覧
- Country Coverはその国の写真からいつでも変更可能

### Trip Page
- 大きなCover Photo＋Instagram風の連続写真フィード（縦横比は元画像のまま、角はほぼスクエア）
- 写真の並べ替え（長押しドラッグ）、「撮影日時順に戻す」ボタン
- 写真ごとにキャプション、明るさ調整（非破壊）、削除（確認ダイアログあり）
- Country / Area / Year / Month / Title / Memoは保存後編集不可（写真のみ編集可能。意図的な仕様）

### Discover
- ユーザーの初期興味・訪問傾向をもとに、毎回3か国をおすすめ（週次で自動更新）
- 紹介写真はWikipediaの実在の写真を使用（AI生成画像は不使用）
- 「なぜおすすめか／見どころ」は、架空の情報を避けるため50か国分を事前にキュレーションした事実ベースのデータを使用
- オフライン時は専用のメッセージ＋再試行ボタンを表示

### AI / おすすめロジックについて
iPhone SafariにおけるオンデバイスAI画像解析（WebGPU/WASM）は現状まだ安定動作が難しいため、V1では**訪問国・初期選択したInterests・エリアの入力語句**などの非画像情報をもとにしたおすすめロジックを実装しています。`js/discover.js`の`pickRecommendations()`が唯一の推薦ロジック窓口となっており、将来オンデバイス画像解析に対応した際も、この関数の内部実装を差し替えるだけで済む設計にしています。

### 言語 / Settings
- 初回起動時に日本語 / Englishを選択（Settingsからいつでも変更可能）
- Settingsは言語切り替えのみ

## 使用方法

1. iPhoneのSafariで公開URLを開く
2. 共有メニューから「ホーム画面に追加」でインストール
3. 初回起動時に言語と興味のあるジャンルを選択
4. 「＋ 旅行を追加」から旅の記録を開始

※ iOS Safariのストレージ仕様上、データを確実に保持するには**ホーム画面に追加して起動する**ことを推奨します（通常のSafariタブでは一定期間アクセスがないとデータが削除される場合があります）。

## 技術構成

- フレームワーク不使用のVanilla JS（ES Modules）+ HTML + CSS の静的PWA
- データ保存：IndexedDB（写真本体もBlobとしてそのまま保存。Base64変換なし）
- オフライン対応：Service Worker（アプリシェルをキャッシュ、Discoverの画像取得はネットワーク優先＋キャッシュフォールバック）
- 世界地図：Natural Earth由来の国境データを均等長方形図法でSVG化（`assets/world-map.svg`）
- 国データ：`data/countries.json`（全世界199の国・地域、国旗絵文字・日英名称・座標）
- Discoverキュレーションデータ：`data/discover-curated.json`（50か国、日英バイリンガル）
- 外部通信は「Discoverの国紹介写真・見どころ取得（Wikipedia API）」のみ。ユーザーの写真やトリップデータは一切送信しない

## フォルダ構成

```
world-travel/
├── index.html              # アプリシェル
├── manifest.json            # PWAマニフェスト
├── sw.js                    # Service Worker
├── css/
│   └── style.css
├── js/
│   ├── app.js               # ルーティング／画面遷移の起点
│   ├── db.js                 # IndexedDBラッパー
│   ├── photos.js / exif.js   # 写真保存・サムネイル生成・撮影日時取得
│   ├── trips.js / prefs.js   # 旅行データ・ユーザー設定
│   ├── map-view.js           # 世界地図・ピン
│   ├── countries-view.js     # Countries・国ページ
│   ├── trip-view.js          # Trip Page（写真フィード等）
│   ├── discover.js / discover-view.js  # Discoverロジック・画面
│   ├── add-travel.js         # 旅行追加フォーム
│   ├── onboarding.js         # 初回起動フロー
│   ├── settings-view.js      # 設定画面
│   ├── i18n.js                # 日英文言
│   ├── ui.js                  # モーダル・確認ダイアログ等の共通部品
│   └── sortable.js            # 写真並べ替え（長押しドラッグ）
├── data/
│   ├── countries.json
│   ├── interests.json
│   └── discover-curated.json
└── assets/
    ├── world-map.svg
    └── icons/
```

## 今後の改善候補

- iOS SafariでのWebGPU/オンデバイスAIの対応状況が成熟した際、写真そのものから旅の雰囲気を分析するローカルAIへの差し替え
- Discoverキュレーション対象国の拡充（現在50か国）
- 簡易的な旅の統計や「過去の旅をランダムに振り返る」機能（V1では意図的に省略）
