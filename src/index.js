import 'swiper/swiper-bundle.css';

import './sass/main.scss';

import adsTpl from './templates/advertising-card.hbs';
import cardTpl from './templates/card.hbs';
import categoriesTpl from './templates/categories.hbs';
import errorTpl from './templates/error.hbs';

import config from './config.json';

import * as API from './lib/api';
import * as Link from './lib/link';
import store from './lib/store';
//import './js/hero';
import './js/auth-form';
import './js/mobile-menu';
import { getUrlCategories } from './js/header';
//import './js/products';
import './js/query';
import './js/modal-advert'
import './js/load-more';
import './js/cardButton';


API.Card.tpl = cardTpl;

API.get.categoryNames().then(rusCategoryNames => {
  rusCategoryNames = { ...config.rusNames, ...rusCategoryNames };
  console.log(rusCategoryNames);
  store.setCategories(rusCategoryNames);

  store.rusCategoryNames = { ...config.rusNames, ...rusCategoryNames };

  const categories = getUrlCategories();
  //store.setQuery({ categories });
  Link.init();

  Link.goTo(location.href);
});
