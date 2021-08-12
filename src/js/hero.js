import adsHero from '../templates/advertising-card.hbs';
import * as API from '../lib/api';
import store from '../lib/store';

const heroContainer = document.querySelector('#hero-root');

API.request('/call/ads').then(data => {
  heroContainer.innerHTML = adsHero(data);
  setIsActive(0);
  store.setHeroData(data);

  let index = 1;
  let isPaused = false;
  setInterval(() => {
    if (!isPaused) {
      heroContainer.innerHTML = adsHero([
        ...store.heroData.slice(index),
        ...store.heroData.slice(0, index),
      ]);
      setIsActive(index);
      index++;
      if (index === store.heroData.length) {
        index = 0;
      }
    }
  }, 2500);

  function setIsActive(ind) {
    heroContainer.querySelectorAll('.hero__order-item').forEach((e, i) => {
      if (i === ind) {
        e.classList.add('is-active-hero-item');
      }
    });
  }
});
