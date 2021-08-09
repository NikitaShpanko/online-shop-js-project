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
import categoryNames from './js/categoryNames';
import { getUrlCategories } from './js/header';
import './js/products';
import './js/query';

categoryNames().then(rusCategoryNames => {
  rusCategoryNames = { ...config.rusNames, ...rusCategoryNames };
  store.setCategories(rusCategoryNames);

  const categories = getUrlCategories();
  store.setQuery({ categories });
  // document.querySelector('body').addEventListener('click', e => {
  //   if (!e.target.closest('a')) return;
  //   const href = e.target.closest('a').getAttribute('href');
  //   console.log(href);
  //   if (href[0] !== '/') return; //если вдруг где внешняя ссылка затешется
  //   e.preventDefault();
  //   mainRender.render(href);
  // });
  // window.addEventListener('popstate', () => mainRender.render());
});
