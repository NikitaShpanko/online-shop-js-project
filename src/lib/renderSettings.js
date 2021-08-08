import * as API from './api.js';
/**
 * Настройки работы класса Render.
 * Один экземпляр может обрабатывать
 * произвольное количество наборов настроек.
 */
export default class RenderSettings {
  /**
   * Метод, которым класс перезаписывает содержимое
   * DOM-элемента.
   *
   * Это статическое свойство для всех экземпляров класса,
   * у которых оно явно не переназначено.
   * @param {Element} element DOM-элемент.
   * @param {string} tplOutput данные, которые вернёт
   * функция `template` или `errorTemplate`. По умолчанию
   * и при работе с Handlebars-шаблонами это строка.
   *
   * Но если Вы переопределяете и `template`/`errorTemplate`,
   * и функции с суффиксом -`DOM`, то вольны использовать любой
   * другой тип данных.
   * @returns
   */
  static replaceDOM = (element, tplOutput) => {
    element.innerHTML = tplOutput;
  };

  /**
   * Аналог метода `replaceDOM` для вывода ошибок.
   *
   * Это статическое свойство для всех экземпляров класса,
   * у которых оно явно не переназначено.
   * @param {Element} element
   * @param {string} tplOutput
   */
  static errorReplaceDOM = (element, tplOutput) => {
    element.innerHTML = tplOutput;
  };

  /**
   * Метод, которым класс дополняет снизу содержимое
   * DOM-элемента.
   *
   * Это статическое свойство для всех экземпляров класса,
   * у которых оно явно не переназначено.
   * @param {Element} element DOM-элемент.
   * @param {string} tplOutput данные, которые вернёт
   * функция `template` или `errorTemplate`. По умолчанию
   * и при работе с Handlebars-шаблонами это строка.
   *
   * Но если Вы переопределяете и `template`/`errorTemplate`,
   * и функции с суффиксом -`DOM`, то вольны использовать любой
   * другой тип данных.
   * @returns
   */
  static appendDOM = (element, tplOutput) => {
    element.insertAdjacentHTML('beforeend', tplOutput);
  };

  /**
   * Аналог метода `appendDOM` для вывода ошибок.
   *
   * Это статическое свойство для всех экземпляров класса,
   * у которых оно явно не переназначено.
   * @param {Element} element
   * @param {string} tplOutput
   */
  static errorAppendDOM = (element, tplOutput) => {
    element.insertAdjacentHTML('beforeend', tplOutput);
  };

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
   * Какого вида ссылки должны обрабатываться
   * по этим настройкам?
   * @param {string} link
   * @returns {boolean}
   */
  #acceptLink = link => false;
  set acceptLink(link) {
    if (typeof link === 'function') {
      this.#acceptLink = link;
    } else {
      this.#acceptLink = smth => smth == link;
    }
  }
  get acceptLink() {
    return this.#acceptLink;
  }

  /**
   * Преобразование ссылки на нашем сайте в ссылку-запрос
   * на бэк-энд.
   *
   * По умолчанию ничего не делает, просто передаёт дальше.
   *
   * Переопределите эту функцию в экземпляре или наследнике класса.
   *
   * Обе ссылки должны начинаться со слэша `/`, но если
   * `link` непригоден для данного экземпляра класса, то
   * функция должна вернуть пустую строку `''` или что-то другое,
   * приводимое к `false`.
   * @param {string} link
   * @returns {string}
   */
  #linkTransform = link => link;
  set linkTransform(link) {
    if (typeof link === 'function') {
      this.#linkTransform = link;
    } else {
      this.#linkTransform = () => link;
    }
  }
  get linkTransform() {
    return this.#linkTransform;
  }

  request = API.request;

  /**
   * Преобразование данных перед подстановкой в шаблон.
   *
   * По умолчанию ничего не делает, просто передаёт дальше.
   *
   * Переопределите эту функцию в экземпляре или наследнике класса.
   * @param {object} data
   * @param {string} link необязательный параметр
   * @returns {object}
   */
  dataTransform = (data, link) => data;

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
   * свойстве `RenderSettings.errorTemplate`.
   * @param {{error: number, errorText: string}} err
   * @returns {string}
   */
  errorTemplate = RenderSettings.errorTemplate;

  /**
   * Метод, которым класс перезаписывает содержимое
   * DOM-элемента.
   *
   * По умолчанию равен функции, заданной в статическом
   * свойстве `RenderSettings.replaceDOM`.
   * @param {Element} element
   * @param {string} tplOutput
   * @returns
   */
  replaceDOM = RenderSettings.replaceDOM;

  /**
   * Аналог метода `replaceDOM` для вывода ошибок.
   *
   * По умолчанию равен функции, заданной в статическом
   * свойстве `RenderSettings.errorReplaceDOM`.
   * @param {Element} element
   * @param {string} tplOutput
   */
  errorReplaceDOM = RenderSettings.errorReplaceDOM;

  /**
   * Метод, которым класс дополняет снизу содержимое
   * DOM-элемента.
   *
   * По умолчанию равен функции, заданной в статическом
   * свойстве `RenderSettings.appendDOM`.
   * @param {Element} element
   * @param {string} tplOutput
   * @returns
   */
  appendDOM = RenderSettings.appendDOM;

  /**
   * Аналог метода `appendDOM` для вывода ошибок.
   *
   * По умолчанию равен функции, заданной в статическом
   * свойстве `RenderSettings.errorAppendDOM`.
   * @param {Element} element
   * @param {string} tplOutput
   */
  errorAppendDOM = RenderSettings.errorAppendDOM;

  /**
   * Позволено ли этому экземпляру класса изменять адрес страницы,
   * вписывая в неё запрос на API-сервер?
   */
  changeLink = false;

  /**
   *
   * @param {RenderSettings} config
   */
  constructor(config = {}) {
    Object.assign(this, config);
  }
}
