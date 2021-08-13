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
export function renderData(data, filterString, linkBefore, clear) {
  const fp = filterAndPaginate(data, filterString, config.maxCategories, 'categoryList');

  const catList = data?.filter(filterString);
  if (!catList) return;

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
  putOnPage(clear)(categoriesTpl(catList));
  //console.log('DATA', data?.filter(filterString), filterString);
}

/**
 * @param {object} category
 * @param {string} filterString
 */
export function renderCategory(category, filterString, linkBefore, clear) {
  API.Card.tpl = categoryCardTpl;
  const fp = filterAndPaginate(category, filterString, config.maxCards, 'cardList');
  putOnPage(clear)(
    searchCardTpl(getCatReady(category.name, category?.filter(filterString), linkBefore)),
  );
  API.Card.tpl = cardTpl;
}

export function render(obj, filterString, linkPrefix, clear = true) {
  if (obj instanceof API.Category) {
    renderCategory(obj, filterString, linkPrefix, clear);
  } else if (obj instanceof API.Data) {
    renderData(obj, filterString, linkPrefix, clear);
    swiperInit();
  } else {
    putOnPage(clear)(errorTpl(obj));
  }
}

function putOnPage(clear, root = document.querySelector('#root')) {
  if (clear)
    return html => {
      root.innerHTML = html;
    };
  else
    return html => {
      root.insertAdjacentHTML('beforeend', html);
    };
}

function filterAndPaginate(obj, filterString, perPage, objListParam) {
  const filtered = obj?.filter(filterString);
  if (!filtered) return false;

  if (!obj.page) obj.page = 1;
  const min = (obj.page - 1) * perPage;
  const max = obj.page * perPage - 1;

  if (max <= obj[objListParam].length) {
  }
}
