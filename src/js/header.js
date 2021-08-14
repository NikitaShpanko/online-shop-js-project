import store from '../lib/store';
import * as Link from '../lib/link';
import headerCategoriesTpl from '../templates/header-categories.hbs';
import headerCategoriesMobileTpl from '../templates/header-categories-mobile.hbs';

//Возвращает массив выбранных категорий по URL
// или пустой массив, если не выбрано ничего
export function getUrlCategories() {
  const queryParams = new URLSearchParams(window.location.search);
  let currentCategoriesUrl = queryParams.getAll('categories');
  if (currentCategoriesUrl.length === 0) {
    return [];
  } else {
    return currentCategoriesUrl[0].split(',');
  }
}

export function getUrlChosenCategory() {
  const queryParams = new URLSearchParams(window.location.search);
  let currentCategoriesUrl = queryParams.getAll('chosenCategory');
  if (currentCategoriesUrl.length === 0) {
    return null;
  } else {
    return currentCategoriesUrl[0];
  }
}

store.register('categories', categories => {
  const toArr = Object.keys(categories).map(key => ({
    key,
    name: categories[key],
    //activeCategories: getUrlCategories(),
  }));
  //.slice(1, 8);

  document.querySelector('#header-categories-mobile').outerHTML = headerCategoriesMobileTpl(toArr);

  document.querySelector('.js-categories-m').addEventListener('click', handler);

  document.querySelector('#header-categories').outerHTML = headerCategoriesTpl(toArr);

  document.querySelector('.js-categories').addEventListener('click', handler);

  function handler(e) {
    e.preventDefault();
    if (!e.target.dataset.category) return;
    store.setQuery({ categories: [e.target.dataset.category] });

    //e.target.closest('li').classList.toggle('is-orange');
    return;

    if (!e.target.closest('a')) return false;
    const category = e.target.getAttribute('data-category');

    if (category) {
      let currentCategoriesUrl = getUrlCategories();
      if (currentCategoriesUrl.length === 0) {
        currentCategoriesUrl.push(category);
      } else {
        if (!currentCategoriesUrl.includes(category)) {
          currentCategoriesUrl.push(category);
        } else {
          const index = currentCategoriesUrl.indexOf(category);
          currentCategoriesUrl.splice(index, 1);
        }
      }

      document.querySelectorAll(`[data-category="${[category]}"]`).forEach(ref => {
        ref.parentNode.classList.toggle('is-orange');
      });

      store.setQuery({ categories: currentCategoriesUrl });
    }
  }
});
