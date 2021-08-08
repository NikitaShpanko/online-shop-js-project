import store from '../lib/store';
import headerCategoriesTpl from '../templates/header-categories.hbs';
import headerCategoriesMobileTpl from '../templates/header-categories.hbs';

console.log(store);

store.register(
  'categories', { 
    notify(categories) {
      const toArr = Object.keys(categories).map(key => ({
        name: categories[key]
      }))
      document.querySelector('#header-categories-mobile')
      .outerHTML = headerCategoriesMobileTpl(toArr);

      document.querySelector('#header-categories')
      .outerHTML = headerCategoriesTpl(toArr);
    },
  }
);

