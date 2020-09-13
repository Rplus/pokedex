import { addMessages, register, init, getLocaleFromNavigator } from 'svelte-i18n'

register('en', () => import('./i18n.en.json'));
register('zh', () => import('./i18n.zh.json'));

const _lang = getLocaleFromNavigator();

init({
  fallbackLocale: 'en',
  initialLocale: _lang && _lang.split('-').shift(),
});
