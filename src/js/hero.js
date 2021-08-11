import adsHero from '../templates/advertising-card.hbs';
import * as API from '../lib/api';

const heroContainer = document.querySelector('#hero-root');

API.request('/call/ads').then(data => {
  heroContainer.innerHTML = adsHero(data);
});
