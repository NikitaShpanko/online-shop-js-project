export default class Item {
  /**
   *
   * @param {object} obj
   * @param {string} param
   * @param {string} query уже проверена, что ненулевая
   * @returns {array}
   */
  static filter = function (obj, query, param = 'category') {
    const queryList = query.split(',');
    return obj.filter(elem => {
      for (const item of queryList) {
        if (elem && elem[param] === item) return true;
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
