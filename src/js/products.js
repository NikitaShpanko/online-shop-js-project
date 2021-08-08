import store from '../lib/store';
import cardTpl from '../templates/card.hbs';
import categoriesTpl from '../templates/categories.hbs';


store.register('products', (products, all) => {
      const toArr = Object.keys(products)
        .map(key => ({
          name: all.categories
            ? all.categories[key]
            : key,
          card: cardTpl(products[key])
        }))

      document.querySelector('#root')
        .innerHTML = categoriesTpl(toArr);
    }
);


