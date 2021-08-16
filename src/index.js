import 'swiper/swiper-bundle.css';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import './sass/main.scss';

import adsTpl from './templates/advertising-card.hbs';
import cardTpl from './templates/card.hbs';
import categoriesTpl from './templates/categories.hbs';
import errorTpl from './templates/error.hbs';

import config from './config.json';

import * as API from './lib/api';
import * as Link from './lib/link';
import store from './lib/store';
import './js/hero';
import './js/auth-form';
import './js/mobile-menu';
import './js/new-modal-advert';
import './js/swiperInit';
import './js/modal-students'
import './js/change-theme';

import { getUrlCategories, getUrlChosenCategory } from './js/header';
//import './js/products';

import './js/query';
//import './js/modal-advert';
import './js/load-more';
import './js/cardButton';
import swiperInit from './js/swiperInit';

API.Card.tpl = cardTpl;

swiperInit();

API.get.categoryNames().then(rusCategoryNames => {
  store.setCategories(rusCategoryNames);

  store.rusCategoryNames = { ...config.rusNames, ...rusCategoryNames };

  // const chosenCategory = getUrlChosenCategory();
  // if (chosenCategory) {
  //   store.setQuery({ chosenCategory });
  //   return;
  // }

  //const categories = getUrlCategories();
  //store.setQuery({ categories });
  Link.init();

  Link.goTo(location.href, false);
});
