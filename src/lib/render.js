import * as API from './api.js';
import config from '../config.json';

/**
 * Класс Render прорисовывает данные API в выбранном DOM элементе.
 *
 * То есть буквально: на входе адрес GET-запроса, на выходе -
 * замена `innerHTML` в заданном
 */
export default class Render {
  /**
   * Шаблон ошибки, по умолчанию выдаёт JSON.
   *
   * Это статическое свойство для всех экземпляров класса,
   * у которых оно явно не переназначено.
   *
   * @param {{error: number, errorText: string}} err
   * @returns {string}
   */
  static errorTemplate = err => JSON.stringify(err);

  /**
   * Родительский элемент, HTML которого и будет перезаписываться.
   * Задаётся и проверяется в конструкторе и в сеттере (на всякий случай).
   */
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
   * Преобразование данных перед подстановкой в шаблон.
   *
   * По умолчанию ничего не делает, просто передаёт дальше.
   *
   * Переопределите эту функцию в экземпляре или наследнике класса.
   * @param {object} data
   * @returns {object}
   */
  dataTransform = data => data;

  /**
   * Шаблон, т. е. преобразование данных в HTML-код.
   *
   * По умолчанию возвращает не HTML, а JSON, просто потому, что так проще.
   *
   * Переопределите эту функцию в экземпляре или наследнике класса.
   *
   * Можно просто присвоить переменной `template` функцию-шаблон (не вызов
   * функции, а именно саму функцию).
   * @param {object} data
   * @returns {string}
   */
  template = data => JSON.stringify(data);

  /**
   * Шаблон ошибки для данного экземпляра класса.
   *
   * По умолчанию равен функции, заданной в статическом
   * свойстве `Render.errorTemplate`.
   * @param {{error: number, errorText: string}} err
   * @returns {string}
   */
  errorTemplate = Render.errorTemplate;

  /**
   * Позволено ли этому экземпляру класса изменять адрес страницы,
   * вписывая в неё запрос на API-сервер?
   */
  changeLink = false;

  /**
   * Позволено ли этому экземпляру класса изменять адрес,
   * когда пользователь заходит на основную страницу (имитация
   * переадресации)?
   */
  changeLinkOnRoot = false;

  /**
   * Конструктор создаёт экземпляр класса с достаточно примитивным поведением:
   * выдающий в DOM-элемент JSON, пришедший с сервера. Без всякого форматирования.
   *
   * Но поведение экземпляра можно и нужно изменять, переопределяя его функции
   * (точнее, свойства-ссылки на функции), а именно `dataTransform` и `template`.
   *
   * Также, если это необходимо, можно включить изменение адреса без перезагрузки
   * страницы, с помощью свойств `changeLink` и `changeLinkOnRoot`.
   *
   * @param {Element | string} parent элемент, в котором осуществляется прорисовка
   */
  constructor(parent = document) {
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
  }
  /**
   * Основной метод данного класса.
   *
   * Отправляет GET-запрос по заданному адресу, обрабатывает ответ, как предписано
   * функцией `dataTransform` и выдаёт результат в DOM по шаблону `template`.
   *
   * Умеет по умолчанию адреса работать с текущим адресом страницы
   * и сам может изменять его без перезагрузки, если ему дадут на это
   * полномочия свойствами `changeLink` и `changeLinkOnRoot`.
   *
   * @param {string} link  должен начинаться со слэша, по умолчанию -
   * "хвост" текущего адреса страницы.
   */
  async render(link = this.#linkTail()) {
    let changeLink = this.changeLink;
    if (link === '/' || link === '/index.html') {
      link = config.defaultServerLink;
      changeLink = this.changeLinkOnRoot;
    }
    if (changeLink) this.#changeHistory(link);

    try {
      const data = await API.request(link);
      if (data.hasOwnProperty('error')) throw { error: data.error, errorText: data.errorText };
      this.#parent.innerHTML = this.template(this.dataTransform(data));
    } catch (err) {
      this.#parent.innerHTML = this.errorTemplate(err);
    }
  }

  /**
   * Метод похож на `render`, но более примитивен: не умеет работать с
   * адресом страницы. Да ему это и не нужно, ведь его предназначение -
   * помочь нам реализовать функционал "Загрузить ещё".
   *
   * @param {string} link должен начинаться со слэша, на сей раз этот
   * параметр обязателен.
   */
  async append(link) {
    try {
      const data = await API.request(link);
      if (data.hasOwnProperty('error')) throw { error: data.error, errorText: data.errorText };
      this.#parent.insertAdjacentHTML('beforeend', this.template(this.dataTransform(data)));
    } catch (err) {
      this.#parent.insertAdjacentHTML('beforeend', this.errorTemplate(err));
    }
  }

  /**
   * Достучаться до родительского элемента можно здесь.
   *
   */
  get parent() {
    return this.#parent;
  }

  /**
   * Вообще не рекомендовал бы перезадавать родительский элемент,
   * но на тот случай, если DOM перерисовали, и старые ссылки на
   * элементы безвозвратно утеряны, то можно перезадать родителя,
   * просто изменив это свойство на новый элемент или строку-селектор
   * нового элемента.
   * @param {Element|string} newParent Для чтения здесь всегда
   * хранится сам элемент. Но записывать можно и строку-селектор.
   */
  set parent(newParent) {
    if (typeof newParent === 'string') {
      newParent = document.querySelector(newParent);
    }
    if (!newParent instanceof Element) {
      throw "Parameter 'parent' doesn't represent a valid DOM Element.";
    }
    this.#parent = newParent;
  }
}
