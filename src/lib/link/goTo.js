import { textAfter, render } from './_utils';
import { syncHearts } from './_hearts';
import parse from './parse';
import setSearchParam from './setSearchParam';
import deleteHash from './deleteHash';

import authorizationFormTpl from '../../templates/authorization-form.hbs';
//import * as Modal from '../../js/modal-control';
import { openAuthModal } from '../../js/auth-form';
import { openModalCard } from '../../js/cardButton';

import { error } from '@pnotify/core';

import * as API from '../api';
import store from '../store';

import config from '../../config.json';
/**
 * @param {string} link
 */
export default async function goTo(link, refreshOnline = true, pushState = true) {
  const hero = document.querySelector('#hero-root');
  hero.style.display = 'none';
  let linkPrefix = '';
  let { pathList, search, shortLink, hash } = parse(link);

  if (hash.length && shortLink !== '/') return goTo(`/#${hash}`, refreshOnline, pushState);

  const filterString = search.categories ? search.categories : '';

  if (!store.products && filterString.length) {
    store.query.categories = filterString.split(',');
  }

  document.querySelectorAll(`[data-category]`).forEach(sel => {
    const li = sel.closest('li');
    if (filterString.includes(sel.dataset.category)) {
      li.classList.add('is-orange');
    } else {
      li.classList.remove('is-orange');
    }
  });

  store.query.search = '';
  //document.querySelectorAll('.js-input-search').forEach(elem => (elem.value = ''));
  if (pathList.includes('profile')) {
    if (store.isOnline && !store.isOnline.error) {
      linkPrefix = '/profile/';
      const possibleCategory = textAfter(pathList, 'profile');
      if (possibleCategory === 'own') {
        if (refreshOnline) {
          store.products = await API.get.request('​/call/own', localStorage.accessToken);
        } else {
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
        }
      }
    } else {
      return goTo(setSearchParam('/login', 'redirect', shortLink));
    }
  } else {
    if (pathList.includes('login')) {
      if (!store.isOnline) openAuthModal();
      else return goTo(search.redirect ? search.redirect : '/', false);
    } else {
      if (search.search) {
        store.products = await API.request(setSearchParam('/call/find', 'search', search.search));
        //document.querySelectorAll('.js-input-search').forEach(elem => (elem.value = search.search));
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
          hero.style.display = '';
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

  render(store.products, filterString, linkPrefix);

  await syncHearts(pathList, refreshOnline);

  if (pushState) history.pushState(null, null, shortLink);
  else deleteHash();

  if (hash.length) {
    if (store.products.getCard(hash)) openModalCard(hash);
    else {
      error(`Товар с кодом "${hash}" не существует!`);
      //if (!pushState) deleteHash();
    }
  }
  return shortLink;
}
