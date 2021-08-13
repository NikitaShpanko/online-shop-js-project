import { render } from './_utils'; //
import store from '../store'; //

/**/ export default function loadNextPage() {
  store.products.page++; //
  render(store.products, store.products.filterString, store.products.linkPrefix); //
} //
