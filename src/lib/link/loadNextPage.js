import { render } from './_utils';
import { syncHearts } from './_hearts';
import parse from './parse';
import store from '../store';

export default function loadNextPage() {
  store.products.page++;
  render(store.products, store.products.filterString, store.products.linkPrefix);
  syncHearts(parse(location.href).pathList, true);
}
