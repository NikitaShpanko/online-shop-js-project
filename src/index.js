import './sass/main.scss';
import initCardButton from './js/cardButton';

import adsTpl from './templates/advertising-card.hbs';
import cardTpl from './templates/card.hbs';
import categoriesTpl from './templates/categories.hbs';
import errorTpl from './templates/error.hbs';

import storeIsOnline from './js/storeIsOnline';
import storeCategories from './js/storeCategories';
import storeProducts from './js/storeProducts';
import storeQuery from './js/storeQuery';

import config from './config.json';

import * as API from './lib/api';
import store from './lib/store';

import renderHero from './js/hero';
import { checkLogin, initAccountControl } from './js/auth-form';
import initMobileMenu from './js/mobile-menu';
import getUrlCategories from './js/header';
import './js/modal-advert';
import './js/load-more';
import swiperInit from './js/swiperInit';

API.Card.tpl = cardTpl; // шаблон для карточек по умолчанию

initMobileMenu(); // настройки мобильного меню
initAccountControl(); // настройки элементов управления аккаунтом
swiperInit(); // настройки слайдера
initCardButton(); // настройки показа отдельного товара

// callback-функции:
store.register('isOnline', storeIsOnline); //login/logout
store.register('categories', storeCategories); // прорисовка категорий
store.register('products', storeProducts); // прорисовка товаров
store.register('query', storeQuery); // поисковые запросы

(async () => {
  store.setCategories(await API.get.categoryNames());
  await checkLogin();
  await renderHero();
  const categories = getUrlCategories();
  store.setQuery({ categories });
})();
