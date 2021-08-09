import store from '../lib/store';
import headerCategoriesTpl from '../templates/header-categories.hbs';
import headerCategoriesMobileTpl from '../templates/header-categories-mobile.hbs';
import * as API from '../lib/api';

store.register('categories', (categories) => {
      const toArr = Object.keys(categories)
        .map(key => ({
          key,
          name: categories[key]
        })).slice(1, 8)

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
        const category = e.target.getAttribute('data-category')
        console.log(e.target.getAttribute('data-category'))

        if (category) {
          API.request(`/call/specific/${category}`)
            .then(data => store.setProducts({ [category]: data }));

            const queryParams = new URLSearchParams(window.location.search);
            queryParams.set('categories', category);

            window.history.pushState(null, null, "?"+queryParams.toString());
        }
      }

    },
);



