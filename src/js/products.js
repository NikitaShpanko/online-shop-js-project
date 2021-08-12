import store from '../lib/store';
import cardTpl from '../templates/card.hbs';
import categoriesTpl from '../templates/categories.hbs';
import searchCardTpl from '../templates/search-allcard.hbs';
import Swiper from 'swiper/bundle';
import 'swiper/swiper-bundle.css';
import SwiperCore, { Navigation, Pagination } from 'swiper/core';

store.register('products', (pr, all) => {
  let products = null;
  if (typeof pr === Array.isArray(pr)) {
    products = pr;
  } else {
    products = { ...pr };
    delete products.categoryList;
  }

  if (all.query !== null && (all.query.search || all.query.chosenCategory)) {
    document.querySelector('#root').innerHTML = searchCardTpl({
      name: 'Результат поиска',
      card: cardTpl(products),
    });

    return;
  }

  const toLower = {};

  Object.keys(all.categories).forEach(key => (toLower[key.toLowerCase()] = all.categories[key]));

  const toArr = Object.keys(products).map(key => ({
    name: toLower[key.toLowerCase().replace(/ /g, '')],
    card: cardTpl(products[key]),
    key,
  }));

  document.querySelector('#root').innerHTML = categoriesTpl(toArr);

  const showAllArr = document.querySelectorAll('.js-show-all');

  showAllArr.forEach(cat => {
    cat.addEventListener('click', e => {
      const chosenCategory = e.target.getAttribute('data-key');
      console.log(chosenCategory);
      store.setQuery({ chosenCategory });
    });
  });

  const swiper = new Swiper('.swiper-container', {
    slidesPerView: 4,
    spaceBetween: 20,
    slidesPerGroup: 4,
    loopFillGroupWithBlank: true,
    // navigation: {
    //   nextEl: '.button__arow-right',
    //   prevEl: '.button__arow--left',
    // },

    breakpoints: {
      320: {
        slidesPerView: 1,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 22,
      },
      1280: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
    },
  });

  console.log(swiper);

  const arrowRightRef = document.querySelector('button[data-action="right"]');
  console.log(arrowRightRef.dataset.action);
  const arrowLefttRef = document.querySelector('button[data-action="left"]');

  document.querySelector('#root').addEventListener('click', e => {
    if (e.target.dataset.action === 'right') {
      e.target
        .closest('.categories__container')
        .querySelector('.swiper-container')
        .swiper.slideNext();
    }

    if (e.target.dataset.action === 'left') {
      e.target
        .closest('.categories__container')
        .querySelector('.swiper-container')
        .swiper.slidePrev();
    }
  });
});
