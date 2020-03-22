import GAnalytics from 'ganalytics';
import App from '@c/App.html';

new App({
  target: document.body
});

if (process.env.NODE_ENV === 'production') {
  window.ga = new GAnalytics('UA-161563451-1');
}
