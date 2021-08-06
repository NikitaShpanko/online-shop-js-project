import cardTpl from '../templates/card.hbs';
import categoriesTpl from '../templates/categories.hbs';

import * as API from './api.js';
import config from '../config.json';

/** Класс Render прорисовывает основной контент на нашей странице. */
export default class Render {
  #parent;
  /**
   * Приватная функция, возвращающая "хвост" текущего адреса страницы,
   * независимо от того, находится ли она на ГитХабе или на наших локальных
   * серверах.
   * @type {() => string}
   */
  #linkTail;
  /**
   * Приватная функция, изменяющая строку истории браузера независимо от того,
   * находится ли сайт на ГитХабе или на наших локальных серверах.
   * @type {function (string)}
   */
  #changeHistory;
  /**
   * @param {Element | string} parent элемент, в котором осуществляется прорисовка
   * @param {boolean} drawOnLoad нужно ли выполнять прорисовку
   * автоматически при загрузке страницы (по умолчанию `true`)
   */
  constructor(parent = document, drawOnLoad = true) {
    if (typeof parent === 'string') {
      parent = document.querySelector(parent);
    }
    if (!parent instanceof Element) {
      throw "Parameter 'parent' doesn't represent a valid DOM Element.";
    }
    this.#parent = parent;

    const link = location.href;
    let start = link.toLowerCase().indexOf(config.projectName);
    if (start < 0) {
      this.#linkTail = () => location.pathname + location.search;
      this.#changeHistory = tail => history.pushState(null, null, tail);
    } else {
      const cutAt = start + config.projectName.length;
      this.#linkTail = () => link.slice(cutAt);
      const rootUrl = link.slice(0, cutAt);
      this.#changeHistory = tail => history.pushState(null, null, rootUrl + tail);
    }
    if (drawOnLoad) this.drawLink();
  }
  /**
   * Основной метод данного класса.
   *
   * Принимает решение, что рисовать, исходя из указанного адреса.
   *
   * @param {string} link  должен начинаться со слэша, по умолчанию -
   * "хвост" текущего адреса страницы.
   */
  async drawLink(link = this.#linkTail()) {
    let changeHistory = true;
    if (link === '/' || link === '') {
      link = config.defaultServerLink;
      changeHistory = false;
    }
    try {
      const data = await API.request(link);
      this.#parent.innerHTML = cardTpl(Object.values(data)[0]);
      //this.#parent.innerText = JSON.stringify(Object.values(data)[0]);
      if (changeHistory) this.#changeHistory(link);
    } catch (err) {
      this.#parent.innerText = err;
    }
  }
}
