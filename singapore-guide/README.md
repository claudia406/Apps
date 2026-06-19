# 母娘シンガポール旅行 2026

2026年9月19日〜27日の母娘シンガポール旅行に向けた、個人用旅行ガイドWebアプリ。

## アプリ概要

PWA（Progressive Web App）対応の旅行ガイド。スマートフォンのホーム画面に追加して、旅行中にオフラインでも使用できる。出発までのカウントダウンや、日程・スポット・グルメなど旅に必要な情報をまとめて管理する。

## 主な機能

- 出発日までのカウントダウン表示
- 旅行中は「今日のプラン」への直リンク自動表示
- 日程プラン（7日分の詳細スケジュール）
- 観光スポット図鑑
- グルメ図鑑
- Disney Adventureクルーズガイド（3泊）
- 旅の準備チェックリスト
- シンガポール基礎知識
- ボトムナビゲーションによる快適な画面遷移
- PWA対応（オフライン利用・ホーム画面追加）

## 旅行概要

- 期間：2026年9月19日（土）〜9月27日（日）
- フライト：成田 ↔ チャンギ
- メンバー：母娘2名
- ホテル：Changi Cove → Aurum Royal → Disney Adventure（クルーズ3泊）→ Hotel Waterloo Singapore

## 使用方法

1. GitHub PagesのURLにアクセス
2. スマートフォンでホーム画面に追加するとアプリとして使用可能
3. 各ページはボトムナビまたはホームのクイックナビからアクセス

## 技術構成

- HTML / CSS / JavaScript（純粋なバニラ実装）
- PWA（manifest.json + Service Worker）
- 外部ライブラリなし・単一フォルダ完結

## フォルダ構成

```
singapore-guide/
├── index.html        # ホーム（カウントダウン・旅行概要）
├── schedule.html     # 日程プラン概要
├── day1.html         # Day 1 詳細
├── day2.html         # Day 2 詳細
├── day3.html         # Day 3 詳細
├── day4.html         # Day 4 詳細
├── day5.html         # Day 5 詳細
├── day6.html         # Day 6 詳細
├── day7.html         # Day 7 詳細
├── spots.html        # スポット図鑑
├── gourmet.html      # グルメ図鑑
├── cruise.html       # クルーズガイド
├── prep.html         # 旅の準備チェックリスト
├── basics.html       # シンガポール基礎知識
├── manifest.json     # PWAマニフェスト
├── sw.js             # Service Worker
├── css/
│   └── style.css     # 共通スタイル
├── js/
│   └── app.js        # カウントダウン・Today機能など
└── icons/
    ├── icon-192.svg
    └── icon-512.svg
```
