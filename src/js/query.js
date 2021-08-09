import store from '../lib/store';
import * as API from '../lib/api';

store.register('query', (query) => {
  if (query && query.search && query.search.length) {
    return;
  }

  if (query && query.categories && query.categories.length) {
    const currentCategoriesUrl = query.categories;
    const allPromise = [];
    currentCategoriesUrl.forEach(currentCategoryUrl => {
      allPromise.push(API.request(`/call/specific/${currentCategoryUrl}`))
    })
    
    //Добавляет параметр в URL
    const queryParams = new URLSearchParams();
    queryParams.set('categories', currentCategoriesUrl);
    window.history.pushState(null, null, "?"+queryParams.toString());

    Promise.all(allPromise).then(data => {
      const res = {};
      if (data && data.length) {
        data.forEach(row => {
          if (row && row.length) {
            const cat = row[0].category;
            res[cat] = row;
          }
        })
      }
      store.setProducts(res)
    });

    return;
  }

  const page = 1
    API.request(`/call?page=${page}`)
    .then(data => store.setProducts(data));

});