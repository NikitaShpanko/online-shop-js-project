import Swiper from 'swiper/bundle';

import { textAfter, renderData, renderCategory, renderAds } from './_utils';
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
  let { pathList, search, shortLink } = parse(link);
  const filterString = search.categories;
  if (pathList.includes('profile')) {
    if (store.isOnline && !store.isOnline.error) {
      const possibleCategory = textAfter(pathList, 'profile');
      if (possibleCategory === 'own') {
        renderCategory(await API.get.request('​/call/own', localStorage.accessToken), filterString);
      } else if (possibleCategory === 'favourite') {
        renderCategory(
          await API.get.request('​/call/favourites', localStorage.accessToken),
          filterString,
        );
      } else {
        renderData(await API.get.request('/user', localStorage.accessToken), filterString);
      }
    } else {
      return goTo(setSearchParam('/login', 'redirect', shortLink));
    }
  } else {
    if (pathList.includes('login')) {
      Modal.openModal(authorizationFormTpl()); //actually need some function here
    } else {
      if (search.query) {
        renderCategory(
          await API.request(setSearchParam('/call/find', 'search', search.query)),
          filterString,
        );
      } else {
        const possibleCategory = textAfter(pathList, 'category');
        if (possibleCategory) {
          renderCategory(await API.request(`/call/specific/${possibleCategory}`), filterString);
        } else {
          renderAds(await API.request('/call/ads'));
          renderData(
            (await API.request('/call?page=1'))
              ?.append(await API.request('/call?page=2'))
              ?.append(await API.request('/call?page=3')),
            filterString,
            false,
          );
          shortLink = '/';
          for (const param in search) {
            shortLink = setSearchParam(shortLink, param, search[param]);
          }
        }
      }
    }
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
