import './sass/main.scss';
import './js/cardButton';

import adsTpl from './templates/advertising-card.hbs';
import cardTpl from './templates/card.hbs';
import categoriesTpl from './templates/categories.hbs';
import errorTpl from './templates/error.hbs';

import config from './config.json';

import * as API from './lib/api';
import store from './lib/store';

import './js/auth-form';
import './js/mobile-menu';
import { getUrlCategories } from './js/header';
import './js/products';
import './js/query';

API.Card.tpl = cardTpl;

//////////
// TEST //
//////////
const email = 'user@example.com';
const password = 'qwerty123';
API.login(email, password)
  //.then(data => data.accessToken)
  //.then(token => API.get.user(token))
  .then(data => console.log(data.getCard('5fda748df548230017d87db9')));
///////////
///////////

API.get.categoryNames().then(rusCategoryNames => {
  rusCategoryNames = { ...config.rusNames, ...rusCategoryNames };
  store.setCategories(rusCategoryNames);

  const categories = getUrlCategories();
  store.setQuery({ categories });
});
