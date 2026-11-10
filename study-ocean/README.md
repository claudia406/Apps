# Study Ocean (study-ocean)

「毎日の積み重ねが、静かに海を育てていく。」をコンセプトにした、Shiori さん専用の勉強記録 PWA です。
勉強時間を記録すると海草・サンゴ・水生植物が少しずつ成長し、連続記録の節目で小魚・エビ・カニ・貝などの生き物が解放されます。勉強を休むと海は 7 日かけて徐々に退化しますが、再開すれば同じ速度で回復し、累計時間や過去の記録は決して失われません。

## 概要

- 本人1人だけが使う個人専用アプリ（複数ユーザー向けサービスではない）
- 1 日 30 分以上の学習で「達成」。30 分単位で記録し、合計勉強時間のみを管理する（科目分類なし）
- 海の成長・退化・回復は学習記録そのものとは別に管理され、**過去記録を後から編集しても、すでに確定した海の状態は巻き戻らない**（詳細は下記「海のロジックについて」）
- スマートフォン最優先のレスポンシブ PWA。ホーム画面に追加して利用できる

## 主な機能

### 記録・統計
- ホーム画面でのクイック記録（+30分 / +1時間 / +1時間30分 / +2時間、および任意時間の追加）
- 今日の記録の直接編集、Journal 画面でのカレンダーからの過去日記録の追加・編集（削除機能はなし）
- 未来日の登録禁止、30 分未満・30 分単位以外の入力は拒否
- 週・月・累計の切り替え統計（合計時間、達成日数、連続記録、自己ベスト、1 日平均、勉強した日の平均、1 日の最高記録）
- 月別勉強時間の棒グラフ、月間カレンダーのヒートマップ表示
- 月間目標時間の設定（任意）と達成率表示
- CSV エクスポート（UTF-8 BOM 付き、Excel で文字化けしない）

### 海の成長システム
- Home / Ocean 画面に表示される、学習記録に応じて変化する SVG 製の海（海草・サンゴ・水生植物 + 小魚・エビ・カニ・貝）
- 連続記録 7 / 14 / 21 / 30 / 37 / 45 / 52 / 60 日の節目で新しい生き物・植物を解放（図鑑は Ocean 画面で確認可能）
- 60 日連続達成で最終形態に到達（以降も連続記録・微細な変化は継続）
- 未達成の翌日から 7 日かけて徐々に退化し、再開すると同じ速度で回復

### PWA / データ保全
- ホーム画面への追加に対応（マニフェスト・アイコン一式・インストールボタン）
- オフライン時は専用のオフライン画面を表示（データの二重登録・同期競合を避けるため、オフライン時の書き込みはキューイングせず「保存に失敗しました」として扱い、再試行してもらう設計）
- 保存中 / 保存成功 / 保存失敗を常にトースト通知で明示し、失敗時も入力内容は保持される

## 使用方法

### 日々の記録
ホーム画面を開く → クイック追加ボタンで今日の学習時間を加算、または「任意の時間を追加」から 30 分単位で入力 → 保存

### 過去の記録を直す
Journal 画面 → カレンダーの日付をタップ → 時間をステッパーで設定 → 保存（未来日は選択不可）

### 統計を見る
Stats 画面 → 週 / 月 / 累計タブを切り替え → 月別グラフ・今月のカレンダーで推移を確認

### バックアップ・目標設定
右上（スマホは画面右上、PC はサイドバー下部）の「設定」→ 月間目標の設定、CSV ダウンロード、ホーム画面への追加

## 海のロジックについて（設計メモ）

要件「過去の修正によって現在の海の状態を巻き戻さない」を満たすため、海の状態（`ocean_state` テーブル）は学習記録（`study_records` テーブル）から都度再計算するのではなく、**日付が進むたびに 1 日分ずつ確定させていくイベントソーシング方式**を採用しています。

- `ocean_state.last_evaluated_date` が「評価済みの最後の日付」を保持し、アプリを開くたびに「評価済みの翌日 〜 昨日(JST)」までを 1 日ずつ順に評価して確定させる（今日の記録はまだ確定前のため評価しない）
- 一度確定した日の health / streak はその後に過去記録を編集しても再計算されない
- 退化カーブ: 未達成 1 日目はほぼ変化なし、7 日目で完全に枯れた状態になるよう `health = round(退化開始時のhealth × (7 - 未達日数) / 6)` で計算（詳細仕様の日ごとの表現とほぼ一致するよう設計）
- 回復は成長と同じ速度（達成 1 日ごとに health +1）。回復中に未達成が発生すると、回復前の同じ目標値に向けて退化を再開する

## 本人限定アクセスについて

仕様上「ログイン画面・ユーザー登録画面を設けない」ことが求められているため、アプリ内にログイン UI は実装していません。代わりに **Vercel/ブラウザ標準の HTTP Basic 認証**でオリジン全体を保護しています（`BASIC_AUTH_USER` / `BASIC_AUTH_PASSWORD` 環境変数で設定）。ブラウザのネイティブな認証ダイアログが一度だけ表示され、以降はブラウザ側に認証情報がキャッシュされます。

データベースへの読み書きは Supabase の `service_role` キーを使うサーバー側の Route Handler からのみ行い、クライアントから直接 Supabase を呼び出すことはありません。また `study_records` / `ocean_state` / `monthly_goals` の各テーブルには RLS を有効化した上でポリシーを一切作成していないため、万一 anon キーが漏洩しても外部から読み書きはできません。

## セットアップ

### 1. Supabase プロジェクトの作成

1. [supabase.com](https://supabase.com) でプロジェクトを作成
2. SQL Editor で `supabase/migrations/0001_init.sql` の内容を実行
3. Settings > API から以下を取得
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public キー → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role キー → `SUPABASE_SERVICE_ROLE_KEY`（**絶対に公開しないこと**。サーバー側のみで使用）

### 2. 環境変数の設定

```bash
cp .env.local.example .env.local
```

`.env.local` に Supabase の値、および `BASIC_AUTH_USER` / `BASIC_AUTH_PASSWORD`（本人だけが知る任意の値）を入力してください。

### 3. ローカル開発

```bash
npm install
npm run dev
```

`http://localhost:3000` を開き、設定した Basic 認証の情報を入力します。

### 4. Vercel へのデプロイ

1. Vercel で GitHub リポジトリ `claudia406/Apps` を import
2. プロジェクトの **Root Directory** を `study-ocean` に設定
3. Environment Variables に `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` / `BASIC_AUTH_USER` / `BASIC_AUTH_PASSWORD` を設定（Production / Preview 両方）
4. Deploy

秘密情報と DB を扱うため、GitHub Pages ではなく Vercel でホスティングします（他アプリと異なる点）。

### 5. バックアップについて

Supabase の無料プランはバックアップの保持期間が短いため、長期保存を前提とするなら **Supabase Pro プラン（Point-in-Time Recovery 対応）へのアップグレードを推奨**します。また、設定画面からの CSV エクスポートも定期的なバックアップとして活用できます。

## 技術構成

| 項目 | 採用技術 | 理由 |
|---|---|---|
| フレームワーク | Next.js 16 (App Router, TypeScript, Turbopack) | フロントエンドとサーバーを1プロジェクトで実装できる |
| スタイリング | Tailwind CSS v4 | ユーティリティベースで、淡い色調のデザイントークンを一元管理しやすい |
| データベース | Supabase (PostgreSQL) | マネージド型でバックアップ機能を持つ |
| アクセス制御 | HTTP Basic 認証 (Vercel/ブラウザ標準) + PostgreSQL RLS | ログイン画面を作らずに本人限定アクセスを実現 |
| ホスティング | Vercel | Next.js 公式のホスティング先。HTTPS が標準で有効 |
| バリデーション | zod | API 入力値をサーバー側で検証 |
| グラフ・海の描画 | 独自 SVG + CSS アニメーション（追加ライブラリなし） | 軽量に保ちつつ、状態に応じて変化する表現を実現 |

## フォルダ構成

```
study-ocean/
  supabase/
    migrations/0001_init.sql     … DBスキーマ（Supabase SQL Editorで実行）
  scripts/
    generate-icons.mjs           … アイコン一式を src/app/icon.svg から生成するスクリプト
  src/
    proxy.ts                     … HTTP Basic 認証によるアクセス制御（旧 middleware）
    lib/
      supabase/admin.ts          … service_role キーを使うサーバー専用クライアント
      date.ts                    … 日本時間(JST)基準の日付ユーティリティ
      oceanEngine.ts             … 海の成長・退化・回復の状態遷移ロジック(純粋関数)
      oceanState.ts              … ocean_state テーブルの読み書き・日次評価の実行
      oceanContent.ts            … 生き物・植物の解放条件カタログ
      studyRecords.ts            … 学習記録のCRUD・統計集計
      monthlyGoals.ts            … 月間目標の読み書き
      csv.ts                     … CSV出力(UTF-8 BOM)
      calendarGrid.ts            … カレンダー表示用のグリッド生成
      validation.ts              … zod による入力検証
    components/
      ocean/                     … 海のSVG描画(OceanScene / creatures / oceanVisual)
      AppShell.tsx                … ナビゲーション(モバイル下部タブ / PCサイドバー)
      EditDaySheet.tsx / QuickAddSheet.tsx / SettingsSheet.tsx … ボトムシートUI
      StatsBarChart.tsx           … 月別勉強時間の棒グラフ
    hooks/                        … データ取得用のカスタムフック
    app/
      page.tsx                    … Home
      ocean/page.tsx               … Ocean
      journal/page.tsx             … Journal
      stats/page.tsx                … Stats
      api/                          … Route Handlers (記録・海の状態・統計・目標・CSV)
      manifest.ts                   … PWAマニフェスト
  public/
    sw.js                         … Service Worker(アプリシェル+静的アセットのキャッシュ)
    offline.html                  … オフライン時のフォールバック画面
    icons/                        … PWAアイコン一式
```

## 今後の改善候補

- 海のイラストは現状すべて SVG + CSS アニメーションによる独自表現です。将来的に水彩・色鉛筆調の実イラスト素材に差し替える場合は `src/components/ocean/creatures.tsx` の各 Glyph コンポーネントを置き換えることで対応できます
- オフライン時の記録入力は現状サポートしていません（同期競合を避けるための意図的な設計）。将来的に「オフライン時は端末内に一時保存し、オンライン復帰後に手動で反映を確認する」といった半自動フローを追加する余地があります
- 生き物図鑑のイラストをタップした際の拡大表示や、進化の節目を祝う演出（アニメーション付きのお祝いモーダルなど）は未実装です
