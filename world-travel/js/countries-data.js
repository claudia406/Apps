let countriesPromise = null;

export function getCountries() {
  if (!countriesPromise) {
    countriesPromise = fetch('data/countries.json').then((r) => r.json());
  }
  return countriesPromise;
}

export async function getCountryById(cca2) {
  const countries = await getCountries();
  return countries.find((c) => c.cca2 === cca2) || null;
}

export function countryName(country, lang) {
  if (!country) return '';
  return lang === 'ja' ? country.nameJa : country.nameEn;
}
