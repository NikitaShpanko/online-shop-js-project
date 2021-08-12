import Swiper from 'swiper/bundle';

import { textAfter, renderData, renderCategory, renderAds } from './_utils';
import parse from './parse';
import setSearchParam from './setSearchParam';

import authorizationFormTpl from '../../templates/authorization-form.hbs';
import * as Modal from '../../js/modal-control';

import * as API from '../api';
import store from '../store';

import config from '../../config.json';
/**
 * @param {string} link
 */
export default async function goTo(link) {
  let ads = null;
  let linkPrefix = '';
  let { pathList, search, shortLink } = parse(link);
  const filterString = search.categories;
  if (pathList.includes('profile')) {
    if (store.isOnline && !store.isOnline.error) {
      linkPrefix = '/profile/';
      const possibleCategory = textAfter(pathList, 'profile');
      if (possibleCategory === 'own') {
        store.products = await API.get.request('​/call/own', localStorage.accessToken);
      } else if (possibleCategory === 'favourite') {
        store.products = await API.get.request('​/call/favourites', localStorage.accessToken);
      } else {
        store.products = await API.get.request('/user', localStorage.accessToken);
      }
    } else {
      return goTo(setSearchParam('/login', 'redirect', shortLink));
    }
  } else {
    if (pathList.includes('login')) {
      Modal.openModal(authorizationFormTpl()); //actually need some function here
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
          ads = await API.request('/call/ads');
          store.products = await API.request('/call?page=1');
          //?.append(await API.request('/call?page=2'))
          //?.append(await API.request('/call?page=3'));
          shortLink = '/';
          for (const param in search) {
            shortLink = setSearchParam(shortLink, param, search[param]);
          }
        }
      }
    }
  }

  renderAds(ads);

  if (store.products instanceof API.Category) {
    renderCategory(store.products, filterString, linkPrefix);
  } else if (store.products instanceof API.Data) {
    renderData(store.products, filterString, linkPrefix);
  } else {
    console.log('why the hell?', store.products);
  }

  ////////////////////////////////////////////////
  const swiper = new Swiper('.swiper-container', {
    slidesPerView: 4,
    spaceBetween: 20,
    slidesPerGroup: 4,
    loopFillGroupWithBlank: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    breakpoints: {
      320: {
        slidesPerView: 1,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1280: {
        slidesPerView: 4,
        spaceBetween: 40,
      },
    },
  });
  ////////////////////////////////////////////////
  history.pushState(null, null, shortLink);
  return shortLink;
}
