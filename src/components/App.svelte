<Nav {active} />

<main>
  <svelte:component this={Route} {params} />
</main>

<script>
  import Navaid from 'navaid';
  import About from '@r/About.html';
  import Home from '@r/Home.html';
  import MoveList from '@r/MoveList.html';
  import PokemonList from '@r/PokemonList.html';
  import MovePage from '@r/MovePage.html';
  import PokemonPage from '@r/PokemonPage.html';
  import Info from '@r/Info.html';

  import { onDestroy } from 'svelte';
  import Nav from '@c/Nav.svelte';

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
    .on('/move', () => draw(MoveList))
    .on('/move/:moveId', obj => draw(MovePage, obj))
    .on('/pokemon', () => draw(PokemonList))
    .on('/pokemon/:uid', obj => draw(PokemonPage, obj))
    .on('/info', () => draw(Info))
    .listen();


  onDestroy(router.unlisten);
</script>



<style src="../global.css" global></style>
