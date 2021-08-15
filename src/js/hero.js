import adsHero from '../templates/advertising-card.hbs';
import * as API from '../lib/api';
import store from '../lib/store';

const heroContainer = document.querySelector('#hero-root');

API.request('/call/ads').then(data => {
  const newData = data.map((el, idx) => ({ ...el, index: idx }));
  heroContainer.innerHTML = adsHero(newData);
  setIsActive(0);
  store.setHeroData(newData);
  let firstCard = document.querySelector('.advertising-list__item').classList.add('firstHeroCard');

  let isPaused = false;
  let index = 1;

  heroContainer.addEventListener('click', changeAdsByClick);

  function changeAdsByClick(e) {
    const liNode = e.target.closest('Li');
    if (!liNode || liNode?.classList.contains('firstHeroCard')) {
      return;
    }
    index = +liNode?.dataset.index;
    changePosition();
  }

  setInterval(() => {
    if (!isPaused) {
      changePosition();
    }
  }, 2000);

  function changePosition() {
    heroContainer.innerHTML = adsHero([
      ...store.heroData.slice(index),
      ...store.heroData.slice(0, index),
    ]);
    setIsActive(index);

    const heroNode = heroContainer.querySelector('.hero__container');
    firstCard = document.querySelector('.advertising-list__item').classList.add('firstHeroCard');
    heroNode.addEventListener('mouseenter', () => (isPaused = true));
    heroNode.addEventListener('mouseleave', () => (isPaused = false));

    index++;
    if (index === store.heroData.length) {
      index = 0;
    }
  }

  function setIsActive(ind) {
    heroContainer.querySelectorAll('.hero__order-item').forEach((e, i) => {
      if (i === ind) {
        e.classList.add('is-active-hero-item');
      }
    });
  }
});
