import store from '../lib/store';
import headerCategoriesTpl from '../templates/header-categories.hbs';
import headerCategoriesMobileTpl from '../templates/header-categories-mobile.hbs';

export function getUrlCategories() {
  const queryParams = new URLSearchParams(window.location.search);
  let currentCategoriesUrl = queryParams.getAll('categories');
  if (currentCategoriesUrl.length === 0) {
    return [];
  } else {
    return currentCategoriesUrl[0].split(',');
  }
}

store.register('categories', (categories) => {
      const toArr = Object.keys(categories)
        .map(key => ({
          key,
          name: categories[key],
        })).slice(1, 8);

      document.querySelector('#header-categories-mobile')
        .outerHTML = headerCategoriesMobileTpl(toArr);

      document.querySelector('.js-categories-m')
        .addEventListener('click', handler)

      document.querySelector('#header-categories')
        .outerHTML = headerCategoriesTpl(toArr);

      document.querySelector('.js-categories')
        .addEventListener('click', handler)

      function handler(e) {
        e.preventDefault();

        if (!e.target.closest('a')) return false;
        const category = e.target.getAttribute('data-category')

        if (category) {
          let currentCategoriesUrl = getUrlCategories();
          if (currentCategoriesUrl.length === 0) {
            currentCategoriesUrl.push(category);
          } else {
            if (!currentCategoriesUrl.includes(category)){
              currentCategoriesUrl.push(category);
            } else {
              const index = currentCategoriesUrl.indexOf(category);
              currentCategoriesUrl.splice(index, 1);
            }
          }

          document.querySelectorAll(`[data-category="${[category]}"]`).forEach(ref => {
            ref.parentNode.classList.toggle('is-orange')
          })

          store.setQuery({ categories: currentCategoriesUrl });
        }
      }
    },
);



