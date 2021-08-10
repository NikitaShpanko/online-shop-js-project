export default class Item {
  // /**
  //  * @param {Item} obj
  //  * @returns {string}
  //  */
  // static template = obj => '';
  constructor(data) {
    // Это грубое копирование, но это неважно:
    Object.entries(data).forEach(([key, value]) => {
      this[key] = value;
    });
  }
}
