import { textAfter, render } from './_utils';
import parse from './parse';
import setSearchParam from './setSearchParam';

import authorizationFormTpl from '../../templates/authorization-form.hbs';
//import * as Modal from '../../js/modal-control';
import { openAuthModal } from '../../js/auth-form';

import * as API from '../api';
import store from '../store';

import config from '../../config.json';
/**
 * @param {string} link
 */
export default async function goTo(link, refreshOnline = true) {
  const hero = document.querySelector('#hero-root');
  let linkPrefix = '';
  let { pathList, search, shortLink } = parse(link);
  const filterString = search.categories;
  if (pathList.includes('profile')) {
    hero.style.display = 'none';

    if (store.isOnline && !store.isOnline.error) {
      linkPrefix = '/profile/';
      const possibleCategory = textAfter(pathList, 'profile');
      if (possibleCategory === 'own') {
        if (refreshOnline) {
          store.products = await API.get.request('​/call/own', localStorage.accessToken);
        } else {
          console.log('I SEE:', store.isOnline, 'THERE!');
          store.products = store.isOnline.getCategory('own');
        }
      } else if (possibleCategory === 'favourite') {
        if (refreshOnline) {
          store.products = await API.get.request('​/call/favourites', localStorage.accessToken);
        } else {
          store.products = store.isOnline.getCategory('favourite');
        }
      } else {
        if (refreshOnline) {
          store.products = await API.get.request('/user', localStorage.accessToken);
        } else {
          store.products = store.isOnline;
          console.log('I SEE:', store.isOnline, 'THERE!');
        }
      }
    } else {
      return goTo(setSearchParam('/login', 'redirect', shortLink));
    }
  } else {
    hero.style.display = '';

    if (pathList.includes('login')) {
      if (!store.isOnline) openAuthModal();
      else return goTo(search.redirect ? search.redirect : '/', false);
    } else {
      if (search.search) {
        store.products = await API.request(setSearchParam('/call/find', 'search', search.search));
      } else {
        linkPrefix = '/category/';
        const possibleCategory = textAfter(pathList, 'category');
        if (possibleCategory) {
          if (possibleCategory === config.specialCategory) {
            if (!store.products) store.products = await API.request('/call?page=1');
            store.products = store.products.getCategory(possibleCategory);
          } else {
            store.products = await API.request(`/call/specific/${possibleCategory}`);
          }
        } else {
          //ads = await API.request('/call/ads');
          store.products = (await API.request('/call?page=1'))
            ?.append(await API.request('/call?page=2'))
            ?.append(await API.request('/call?page=3'));
          shortLink = '/';
          for (const param in search) {
            shortLink = setSearchParam(shortLink, param, search[param]);
          }
        }
      }
    }
  }

  if (search.categories) {
    search.categories
      .split(',')
      .forEach(catName => console.log('sel', document.querySelector(`[data-category=${catName}]`)));
    search.categories
      .split(',')
      .forEach(catName =>
        document
          .querySelectorAll(`[data-category=${catName}]`)
          .forEach(sel => sel.closest('li').classList.add('is-orange')),
      );
  }

  render(store.products, filterString, linkPrefix);

  history.pushState(null, null, shortLink);
  return shortLink;
}
