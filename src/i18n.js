import { locale, register, init, getLocaleFromNavigator } from 'svelte-i18n'
import { getItem } from '@/u.js';

export const langMap = {
  en: 'En',
  zh: '中',
};

register('en', () => import('./i18n.en.json'));
register('zh', () => import('./i18n.zh.json'));

const localSettings = getItem('settings') || {};

let navLang = getLocaleFromNavigator();
navLang = navLang && navLang.split('-').shift();

init({
  fallbackLocale: 'en',
  initialLocale: localSettings.lang || navLang,
});

