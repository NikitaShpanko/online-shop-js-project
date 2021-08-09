import RenderSettings from './renderSettings.js';
import { projectName } from '../config.json';

/**
 * Класс Render прорисовывает данные API в выбранном DOM элементе.
 *
 * То есть буквально: на входе адрес GET-запроса, на выходе -
 * замена `innerHTML` в заданном
 */
export default class Render {
  /**
   * Родительский элемент, HTML которого и будет перезаписываться.
   * Задаётся и проверяется в конструкторе и в сеттере (на всякий случай).
   */
  #parent;

  /**
   * Список настроек, которые "умеет" применять данный класс.
   * Формируется в конструкторе или методом `addSetting`.
   */
  #settings = [];

  /**
   * Какие настройки использовались последним на данный момент
   * методом `render` или `append`? Будут доступны для чтения.
   */
  #currentSettings;

  /**
   * Ссылка, по которой отработал последний на данный момент
   * метод `render` или `append`. Будет доступна для чтения.
   */
  #link;

  /**
   * Данные, пришедшие с сервера. Будут доступны для чтения извне.
   */
  #data = {};

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

  #work = async function (link, changeLink, workDOM, saveData, errorWorkDOM, errorSaveData) {
    const settings = this.#settings.filter(setting => setting.acceptLink(link));
    for (const setting of settings) {
      //console.log(setting);
      this.#currentSettings = setting;
      this.#link = link;
      if (changeLink && setting.changeLink) this.#changeHistory(link);
      try {
        const data = await setting.request(setting.linkTransform(link));
        if (data.hasOwnProperty('error')) throw { error: data.error, errorText: data.errorText };
        saveData(data);
        setting[workDOM](this.#parent, setting.template(setting.dataTransform(data, this)));
      } catch (err) {
        setting[errorWorkDOM](this.#parent, setting.errorTemplate(err));
        errorSaveData();
        return false;
      }
    }
    return true;
  };

  /**
   * Конструктор создаёт экземпляр класса, привязанный к одному селектору,
   * но с произвольным количеством настроек.
   *
   * ВНИМАНИЕ! Если ссылка удовлетворяет условиям нескольких наборов настроек,
   * то соответствующие им действия выполнятся одно за другим. Соответственно,
   * один `render` может удалить другой. Впрочем, переопределив методы `replaceDOM`
   * и `errorReplaceDOM` условия, идущего ниже, можно избежать такой проблемы.
   *
   * @param {Element | string} parent элемент, в котором осуществляется прорисовка
   * @param {...RenderSettings} settings настройки, которые должен "уметь"
   */
  constructor(parent, ...settings) {
    if (typeof parent === 'string') {
      parent = document.querySelector(parent);
    }
    if (!parent instanceof Element) {
      throw "Parameter 'parent' doesn't represent a valid DOM Element.";
    }
    this.#parent = parent;

    const link = location.href;
    let start = link.toLowerCase().indexOf(projectName);
    if (start < 0) {
      this.#linkTail = () => location.pathname + location.search;
      this.#changeHistory = tail => history.pushState(null, null, tail);
    } else {
      const cutAt = start + projectName.length;
      this.#linkTail = () => link.slice(cutAt);
      const rootUrl = link.slice(0, cutAt);
      this.#changeHistory = tail => history.pushState(null, null, rootUrl + tail);
    }
    this.addSettings(...settings);
  }

  addSettings(...settings) {
    if (Array.isArray(settings[0])) {
      this.#settings.push(...settings[0]);
    } else {
      this.#settings.push(...settings);
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
    return this.#work(
      link,
      false,
      'appendDOM',
      data => {
        if (Array.isArray(data)) {
          this.#data.push(...data);
        } else {
          Object.assign(this.#data, data);
        }
      },
      'errorAppendDOM',
      () => {},
    );
  }

  /**
   * Основной метод данного класса.
   *
   * Получает адрес, проверяет и преобразует его, как предписано функцией `linkTransform`.
   * Если от неё получен адрес GET-запроса на сервер, то запрос осуществляется, а метод
   * обрабатывает ответ, как предписано функцией `dataTransform` и выдаёт результат в DOM
   * по шаблону `template` методом, заданным функцией `replaceDOM`.
   *
   * Умеет по умолчанию адреса работать с текущим адресом страницы
   * и сам может изменять его без перезагрузки, если ему дадут на это
   * полномочия свойствами `changeLink` и `changeLinkOnRoot`.
   *
   * @param {string} link  должен начинаться со слэша, по умолчанию -
   * "хвост" текущего адреса страницы.
   */
  async render(link = this.#linkTail()) {
    return this.#work(
      link,
      true,
      'replaceDOM',
      data => {
        this.#data = data;
      },
      'errorReplaceDOM',
      () => {
        this.#data = {};
      },
    );
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

  /**
   * Данные, пришедшие с сервера.
   * Доступны для чтения.
   */
  get data() {
    return this.#data;
  }

  /**
   * Текущая ссылка, то есть ссылка, по которой отработал
   * последний на данный момент метод `render` или `append`.
   * Доступна для чтения.
   * @type {string}
   */
  get link() {
    return this.#link;
  }

  /**
   * Текущие настройки, то есть настройки, по которым отработал
   * последний на данный момент метод `render` или `append`.
   * Доступны для чтения (хотя, поскольку это объект, изменить
   * их никто не запретит, но делать это нежелательно).
   * @type {RenderSettings}
   */
  get settings() {
    return this.#currentSettings;
  }
}
