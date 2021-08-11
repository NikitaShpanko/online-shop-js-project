import { renderSomething, renderCategory } from './_render';
import parse from './parse';
import setSearchParam from './setSearchParam';

import authorizationFormTpl from '../../templates/authorization-form.hbs';
import * as Modal from '../../js/modal-control';

import * as API from '../api';
import store from '../store';

/**
 * @param {string} link
 */
export default async function goTo(link) {
  const linkData = parse(link);
  const { pathList, search, shortLink } = linkData;
  if (pathList.includes('index.html')) return goTo('/');
  if (pathList.includes('profile')) {
    if (store.isOnline && !store.isOnline.error) {
      renderSomething(store.isOnline, linkData, 'profile', false);
    } else {
      return goTo(setSearchParam('/login', 'redirect', shortLink));
    }
  } else {
    if (pathList.includes('login')) {
      Modal.openModal(authorizationFormTpl());
    } else {
      if (search.query) {
        renderCategory(
          await API.request(setSearchParam('/call/find', 'search', search.query)),
          linkData,
        );
      } else {
        renderSomething(
          (await API.request('/call?page=1'))
            ?.append(await API.request('/call?page=2'))
            ?.append(await API.request('/call?page=3')),
          linkData,
          'category',
          true,
        );
        //renderSomething(store.products, linkData, 'category', true);
      }
    }
  }
  history.pushState(null, null, shortLink);
  return shortLink;
}
