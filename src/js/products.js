import store from '../lib/store';
import cardTpl from '../templates/card.hbs';
import categoriesTpl from '../templates/categories.hbs';
import searchCardTpl from '../templates/search-allcard.hbs'


store.register('products', (products, all) => {
  if (all.query !== null 
    && (all.query.search || all.query.chosenCategory)
  ) {
    document.querySelector('#root')
      .innerHTML = searchCardTpl({
        name: 'Результат поиска',
        card:  cardTpl(products)
      });

      return;
  }
      const toArr = Object.keys(products)
        .map(key => ({
          name: all.categories
            ? all.categories[key]
            : key,
          card: cardTpl(products[key])
        }))

      document.querySelector('#root')
        .innerHTML = categoriesTpl(toArr);

         // можно сделать по клику "Смотреть все"
        // const test = document.querySelector('.js-show-all')
        // console.log(document.querySelector('.js-show-all'))
        // test.addEventListener('click', () => {
        //   store.setQuery({ chosenCategory });
        // })
    }
);




