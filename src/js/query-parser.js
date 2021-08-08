import store from '../lib/store';
import * as API from '../lib/api';

store.register(
  'page', { 
    notify(page) {
      API.request(`/call?page=${page}`)
        .then(data => store.setProducts(data));
    },
  }
);