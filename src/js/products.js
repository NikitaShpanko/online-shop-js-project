import store from '../lib/store';
import cardTpl from '../templates/card.hbs';
import categoriesTpl from '../templates/categories.hbs';
import searchCardTpl from '../templates/search-allcard.hbs';
import categoryCardsTpl from '../templates/category-cards.hbs';

store.register('products', (pr, all) => {
  let products = null;
  if (typeof pr === Array.isArray(pr)) {
    products = pr;
  } else {
    products = { ...pr };
    delete products.categoryList;
  }

  if (all.query !== null && (all.query.search || all.query.chosenCategory)) {
    let titleCategory = 'Результат поиска';
    if (all.query.chosenCategory) {
      titleCategory = all.categories[all.query.chosenCategory];
    }
    document.querySelector('#root').innerHTML = searchCardTpl({
      name: titleCategory,
      card: categoryCardsTpl(products),
    });

    return;
  }

  const toLower = {};

  Object.keys(all.categories).forEach(key => (toLower[key.toLowerCase()] = all.categories[key]));

  const toArr = Object.keys(products).map(key => ({
    name: toLower[key.toLowerCase().replace(/ /g, '')],
    card: cardTpl(products[key]),
    key,
  }));

  document.querySelector('#root').innerHTML = categoriesTpl(toArr);

  const showAllArr = document.querySelectorAll('.js-show-all');

  showAllArr.forEach(cat => {
    cat.addEventListener('click', e => {
      e.preventDefault();
      const chosenCategory = e.target.getAttribute('data-key');
      store.setQuery({ chosenCategory });
    });
  });
});
