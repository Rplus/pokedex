<Nav {active} />

<main>
  <svelte:component this={Route} {params} />
</main>

<script>
  import Navaid from 'navaid';
  import About from '../routes/About.svelte';
  import Home from '../routes/Home.svelte';

  import { onDestroy } from 'svelte';
  import Nav from './Nav.svelte';

  let Route, params, active;
  let uri = location.pathname;
  $: active = uri.split('/')[1] || 'home';

  function draw(m, obj) {
    params = obj || {};
    Route = m;
    window.scrollTo(0, 0);
  }

  function track(obj) {
    uri = obj.state || obj.uri || location.pathname;
    if (window.ga) ga.send('pageview', { dp:uri });
  }
  addEventListener('replacestate', track);
  addEventListener('pushstate', track);
  addEventListener('popstate', track);

  const router = Navaid('/', () => draw(Home))
    .on('/', () => draw(Home))
    .on('/about', () => draw(About))
    .listen();

  onDestroy(router.unlisten);
</script>



<style src="../global.css" global></style>
