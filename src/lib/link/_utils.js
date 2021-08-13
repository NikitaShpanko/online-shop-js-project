import * as API from '../api';
import store from '../store';
import swiperInit from '../../js/swiperInit';

import config from '../../config.json';

import adsHero from '../../templates/advertising-card.hbs';
import cardTpl from '../../templates/card.hbs';
import categoriesTpl from '../../templates/categories.hbs';
import searchCardTpl from '../../templates/search-allcard.hbs';
import categoryCardTpl from '../../templates/category-cards.hbs';
import errorTpl from '../../templates/error.hbs';

function russify(name) {
  const rusName = store.rusCategoryNames[name];
  return rusName ? rusName : name;
}

/**
 * @param {API.Category} category
 * @param {string} linkBefore - должен начинаться и заканчиваться слэшем,
 * иначе не создаётся вообще
 */
function getCatReady(name, cardList, linkBefore = '') {
  const category = {};
  category.name = russify(name);
  category.card = API.Card.tpl(cardList); //cardTpl(cardList);
  if (linkBefore) {
    category.link = linkBefore + category.name;
  }
  return category;
}

/**
 * @param {string[]} pathList
 * @param {string} keyword
 * @returns {string}
 */
export function textAfter(pathList, keyword) {
  const pathIndex = pathList.indexOf(keyword);
  return pathIndex > -1 && pathIndex < pathList.length - 1 ? pathList[pathIndex + 1] : '';
}

/**
 * @param {object} data
 * @param {string} filterString
 * @param {boolean} clear
 */
export function renderData(data, filterString, linkBefore, method) {
  const catList = filterAndPaginate(data, filterString, config.maxCategories);

  // const catList = data?.filter(filterString);
  // if (!catList) return;

  catList.forEach(cat => {
    if (linkBefore) cat.link = linkBefore + cat.name;
    cat.name = russify(cat.name);
  });
  // const html = categoriesTpl(catList);
  // if (clear) {
  //   document.querySelector('#root').innerHTML = html;
  // } else {
  //   document.querySelector('#root').insertAdjacentHTML('beforeend', html);
  // }
  method(categoriesTpl(catList));
  //console.log('DATA', data?.filter(filterString), filterString);
}

/**
 * @param {object} category
 * @param {string} filterString
 */
export function renderCategory(category, filterString, linkBefore, method) {
  API.Card.tpl = categoryCardTpl;
  const fp = filterAndPaginate(category, filterString, config.maxCards);
  //console.log(getCatReady(category.name, category?.filter(filterString), linkBefore));
  method(searchCardTpl(getCatReady(category.name, fp, linkBefore)));
  API.Card.tpl = cardTpl;
}

export function render(obj, filterString, linkPrefix, method = putOnPage) {
  obj.filterString = filterString;
  obj.linkPrefix = linkPrefix;

  if (obj instanceof API.Category) {
    renderCategory(obj, filterString, linkPrefix, method);
  } else if (obj instanceof API.Data) {
    renderData(obj, filterString, linkPrefix, method);
    swiperInit();
  } else {
    method(errorTpl(obj));
  }

  const btnLoadMore = document.querySelector('.js-load-more');
  if (obj.needsPagination) {
    btnLoadMore.style.display = '';
  } else {
    btnLoadMore.style.display = 'none';
  }
  console.log(btnLoadMore.classList);
}
8;
function putOnPage(html /*clear, root = document.querySelector('#root')*/) {
  document.querySelector('#root').innerHTML = html;
  // if (clear)
  //   return html => {
  //     root.innerHTML = html;
  //   };
  // else
  //   return html => {
  //     root.insertAdjacentHTML('beforeend', html);
  //   };
}

function filterAndPaginate(obj, filterString, perPage) {
  const filtered = obj?.filter(filterString);
  if (!filtered) return [];

  if (!obj.page) obj.page = 1;
  const min = (obj.page - 1) * perPage;
  const max = obj.page * perPage - 1;

  obj.needsPagination = max < filtered.length;

  return filtered.slice(0, max);
  //console.log(min, max, perPage, obj.needsPagination);
}
