import GAnalytics from 'ganalytics';
import App from '@c/App.svelte';

new App({
  target: document.body
});

if (process.env.NODE_ENV === 'production') {
  // window.ga = new GAnalytics('UA-157166080-1');
}
