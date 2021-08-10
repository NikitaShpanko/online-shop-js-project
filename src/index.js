import './sass/main.scss';
import './js/cardButton';

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
import { getUrlCategories } from './js/header';
import './js/products';
import './js/query';

API.Card.tpl = cardTpl;

(async () => {
  let rusCategoryNames = await API.get.categoryNames();
  rusCategoryNames = { ...config.rusNames, ...rusCategoryNames };
  store.setCategories(rusCategoryNames);

  const categories = getUrlCategories();
  store.setQuery({ categories });
})();
