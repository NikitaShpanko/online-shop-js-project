import toCamelCase from './toCamelCase';

export default class Item {
  /**
   *
   * @param {object} obj
   * @param {string} param
   * @param {string} query уже проверена, что ненулевая
   * @param {boolean} camelCase
   * @returns {array}
   */
  static filter = function (obj, query, param = 'category', camelCase = false) {
    const queryList = query.split(',');
    return obj.filter(elem => {
      for (const q of queryList) {
        if (!elem || !elem[param]) return false;
        let item = elem[param];
        item = camelCase ? toCamelCase(item) : item;
        if (item === q) return true;
      }
      return false;
    });
  };
  constructor(data) {
    Object.entries(data).forEach(([key, value]) => {
      this[key] = value;
    });
  }
}
