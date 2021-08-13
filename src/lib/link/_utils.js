import * as API from '../api';
import store from '../store';
import adsHero from '../../templates/advertising-card.hbs';
import cardTpl from '../../templates/card.hbs';
import categoriesTpl from '../../templates/categories.hbs';
import searchCardTpl from '../../templates/search-allcard.hbs';

import categoryCardTpl from '../../templates/category-cards.hbs';

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
export function renderData(data, filterString, linkBefore, clear = true) {
  const catList = data?.filter(filterString);
  if (!catList) return;

  catList.forEach(cat => {
    if (linkBefore) cat.link = linkBefore + cat.name;
    cat.name = russify(cat.name);
  });
  const html = categoriesTpl(catList);
  if (clear) {
    document.querySelector('#root').innerHTML = html;
  } else {
    document.querySelector('#root').insertAdjacentHTML('beforeend', html);
  }
  console.log('DATA', data?.filter(filterString), filterString);
}

/**
 * @param {object} category
 * @param {string} filterString
 */
export function renderCategory(category, filterString, linkBefore) {
  API.Card.tpl = categoryCardTpl;
  console.log(getCatReady(category.name, category?.filter(filterString), linkBefore));
  document.querySelector('#root').innerHTML = searchCardTpl(
    getCatReady(category.name, category?.filter(filterString), linkBefore),
  );
  API.Card.tpl = cardTpl;
}

/**
 * @param {object} adsObj
 */
export function renderAds(adsObj) {
  document.querySelector('#hero-root').innerHTML = adsObj ? adsHero(adsObj) : '';
  console.log('ADS', adsObj);
}
