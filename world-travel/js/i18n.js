const STRINGS = {
  en: {
    navMap: 'Map',
    navCountries: 'Countries',
    navDiscover: 'Discover',

    addTravel: '+ Add Travel',

    onboardLangTitle: 'Choose your language',
    onboardLangSubtitle: 'You can change this later in Settings.',
    onboardInterestsTitle: 'What do you love when you travel?',
    onboardInterestsSubtitle: 'Pick a few things you’re drawn to. This helps Discover find places that fit you — you won’t be able to change this later.',
    onboardInterestsMin: 'Choose at least 1',
    onboardContinue: 'Continue',
    onboardStart: 'Start exploring',

    addTravelTitle: 'Add Travel',
    fieldCountry: 'Country',
    fieldCountryPlaceholder: 'Select a country',
    fieldArea: 'Area / City',
    fieldAreaPlaceholder: 'Optional — e.g. Kyoto, Marrakech',
    fieldYearMonth: 'Year & Month',
    fieldTitle: 'Trip Title',
    fieldTitlePlaceholder: 'Optional',
    fieldMemo: 'Memo',
    fieldMemoPlaceholder: 'Optional',
    fieldPhotos: 'Photos',
    addPhotos: 'Add Photos',
    photosSelected: '{n} photo(s) selected',
    save: 'Save',
    cancel: 'Cancel',
    selectCountryTitle: 'Select a Country',
    close: 'Close',

    tripCoverAlt: 'Trip cover photo',
    memoNone: '',
    restoreCaptureOrder: 'Restore Capture Date Order',
    addPhotosMore: '+ Add Photos',
    editPhoto: 'Edit',
    brightness: 'Brightness',
    captionPlaceholder: 'Add a caption…',
    deletePhoto: 'Delete',
    deletePhotoConfirmTitle: 'Delete this photo?',
    deletePhotoConfirmBody: 'This action cannot be undone.',
    done: 'Done',

    noPhotosYet: 'No photos yet',
    dragToReorder: 'Drag photos to reorder',

    countriesEmpty: 'Your travel map is still blank.\nAdd your first trip to begin.',
    countriesTitle: 'Countries',
    changeCover: 'Change Cover',
    selectCoverPhoto: 'Select a Cover Photo',

    mapEmptyHint: 'Tap “+ Add Travel” to record your first trip',

    discoverTitle: 'Discover',
    discoverSubtitle: 'A few places that might fit your taste',
    discoverWhy: 'Why this might fit you',
    discoverHighlights: 'Worth knowing',
    discoverOffline: 'Discover needs an internet connection.',
    discoverOfflineRetry: 'Try Again',
    discoverLoading: 'Finding places for you…',
    discoverError: 'Couldn’t load Discover right now.',
    discoverStale: 'Showing your last saved picks',
    discoverRefreshedAt: 'Updated {date}',

    settingsTitle: 'Settings',
    settingsLanguage: 'Language',
    settingsLangEn: 'English',
    settingsLangJa: '日本語',

    errStorageTitle: 'Couldn’t save',
    errStorageBody: 'Your device may be low on storage. Try removing a few photos or freeing up space, then try again.',
    errPhotoTitle: 'Couldn’t add this photo',
    errPhotoBody: 'The photo may be in an unsupported format. Try a different photo.',
    ok: 'OK',

    countryOf: 'in {country}',
  },
  ja: {
    navMap: 'マップ',
    navCountries: '国一覧',
    navDiscover: 'Discover',

    addTravel: '＋ 旅行を追加',

    onboardLangTitle: '言語を選択してください',
    onboardLangSubtitle: 'あとから設定で変更できます。',
    onboardInterestsTitle: '旅先で大切にしたいことは？',
    onboardInterestsSubtitle: '興味のあるものをいくつか選んでください。Discoverのおすすめに反映されます（あとから変更はできません）。',
    onboardInterestsMin: '1つ以上選択してください',
    onboardContinue: '次へ',
    onboardStart: 'はじめる',

    addTravelTitle: '旅行を追加',
    fieldCountry: '国',
    fieldCountryPlaceholder: '国を選択',
    fieldArea: 'エリア・都市',
    fieldAreaPlaceholder: '任意 — 例：京都、マラケシュ',
    fieldYearMonth: '年・月',
    fieldTitle: 'タイトル',
    fieldTitlePlaceholder: '任意',
    fieldMemo: 'メモ',
    fieldMemoPlaceholder: '任意',
    fieldPhotos: '写真',
    addPhotos: '写真を追加',
    photosSelected: '{n}枚選択中',
    save: '保存',
    cancel: 'キャンセル',
    selectCountryTitle: '国を選択',
    close: '閉じる',

    tripCoverAlt: '旅行のカバー写真',
    memoNone: '',
    restoreCaptureOrder: '撮影日時順に戻す',
    addPhotosMore: '＋ 写真を追加',
    editPhoto: '編集',
    brightness: '明るさ',
    captionPlaceholder: 'キャプションを追加…',
    deletePhoto: '削除',
    deletePhotoConfirmTitle: 'この写真を削除しますか？',
    deletePhotoConfirmBody: 'この操作は取り消せません。',
    done: '完了',

    noPhotosYet: 'まだ写真がありません',
    dragToReorder: '長押しでドラッグして並べ替え',

    countriesEmpty: 'まだ旅の記録がありません。\n最初の旅行を追加してみましょう。',
    countriesTitle: '国一覧',
    changeCover: 'カバーを変更',
    selectCoverPhoto: 'カバー写真を選択',

    mapEmptyHint: '「＋ 旅行を追加」から最初の旅を記録しましょう',

    discoverTitle: 'Discover',
    discoverSubtitle: '気になる場所が見つかるかもしれません',
    discoverWhy: 'おすすめの理由',
    discoverHighlights: '知っておきたいこと',
    discoverOffline: 'Discoverの利用にはインターネット接続が必要です。',
    discoverOfflineRetry: '再試行',
    discoverLoading: 'あなたに合う場所を探しています…',
    discoverError: 'Discoverを読み込めませんでした。',
    discoverStale: '前回保存されたおすすめを表示しています',
    discoverRefreshedAt: '{date} 更新',

    settingsTitle: '設定',
    settingsLanguage: '言語',
    settingsLangEn: 'English',
    settingsLangJa: '日本語',

    errStorageTitle: '保存できませんでした',
    errStorageBody: '端末のストレージ容量が不足している可能性があります。写真を整理するか空き容量を確保してから、もう一度お試しください。',
    errPhotoTitle: 'この写真を追加できませんでした',
    errPhotoBody: '対応していない形式の可能性があります。別の写真をお試しください。',
    ok: 'OK',

    countryOf: '{country}',
  },
};

const MONTHS = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  ja: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
};

let currentLang = 'ja';

export function setLang(lang) {
  currentLang = STRINGS[lang] ? lang : 'ja';
  document.documentElement.lang = currentLang;
}

export function getLang() {
  return currentLang;
}

export function t(key, vars) {
  let str = (STRINGS[currentLang] && STRINGS[currentLang][key]) ?? STRINGS.ja[key] ?? key;
  if (vars) {
    for (const k of Object.keys(vars)) {
      str = str.replaceAll(`{${k}}`, vars[k]);
    }
  }
  return str;
}

export function monthName(monthIndex1to12) {
  return MONTHS[currentLang][monthIndex1to12 - 1];
}

export function pinLabel(year, month) {
  const lang = currentLang;
  if (lang === 'ja') return `${year}年${MONTHS.ja[month - 1]}`;
  return `${MONTHS.en[month - 1].toUpperCase()} ${year}`;
}
