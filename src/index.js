import './sass/main.scss';

import adsTpl from './templates/advertising-card.hbs';
import cardTpl from './templates/card.hbs';
import categoriesTpl from './templates/categories.hbs';
import errorTpl from './templates/error.hbs';

import config from './config.json';

import * as API from './lib/api';
import store from './lib/store';
import './js/hero';
import './js/auth-form';
import './js/mobile-menu';
import { getUrlCategories, getUrlChosenCategory } from './js/header';
import './js/products';
import './js/query';
import './js/modal-advert';
import './js/load-more';
import './js/cardButton';


API.Card.tpl = cardTpl;

API.get.categoryNames().then(rusCategoryNames => {
  rusCategoryNames = { ...config.rusNames, ...rusCategoryNames };
  console.log(rusCategoryNames);
  store.setCategories(rusCategoryNames);

  const chosenCategory = getUrlChosenCategory();
  if (chosenCategory) {
    store.setQuery({ chosenCategory });
    return;
  }

  const categories = getUrlCategories();
  store.setQuery({ categories });
});
