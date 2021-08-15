import { render } from './_utils';
import { syncHearts } from './_hearts';
import parse from './parse';
import store from '../store';
import * as API from '../api';

export default function loadNextPage() {
  store.products.page++;
  render(store.products, store.products.filterString, store.products.linkPrefix, appendMethod);
  syncHearts(parse(location.href).pathList, true);
}

function appendMethod(html) {
  let where = '#root';
  if (store.products instanceof API.Category) {
    where = '.category__card-list';
    const newEl = document.createElement('div');
    newEl.innerHTML = html;
    html = newEl.querySelector(where).innerHTML;
  }
  document.querySelector(where).insertAdjacentHTML('beforeend', html);
}
