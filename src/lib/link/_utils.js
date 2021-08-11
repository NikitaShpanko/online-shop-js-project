// import * as API from '../api';
import adsHero from '../../templates/advertising-card.hbs';
import cardTpl from '../../templates/card.hbs';
import categoriesTpl from '../../templates/categories.hbs';
import searchCardTpl from '../../templates/search-allcard.hbs';

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
export function renderData(data, filterString, clear = true) {
  const html = categoriesTpl(data?.filter(filterString));
  if (clear) {
    document.querySelector('main').innerHTML = html;
  } else {
    document.querySelector('main').insertAdjacentHTML('beforeend', html);
  }
  console.log('DATA', data?.filter(filterString), filterString);
}

/**
 * @param {object} category
 * @param {string} filterString
 */
export function renderCategory(category, filterString) {
  document.querySelector('main').innerHTML = searchCardTpl({
    name: category.name,
    card: cardTpl(category?.filter(filterString)),
  });
  console.log('CATEGORY', category?.filter(filterString), filterString);
}

/**
 * @param {object} adsObj
 */
export function renderAds(adsObj) {
  document.querySelector('main').innerHTML = adsHero(adsObj);
  console.log('ADS', adsObj);
}
