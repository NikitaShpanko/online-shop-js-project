export default class Item {
  static copy = function (obj) {
    if (typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(elem => Item.copy(elem));
    else {
      const newObj = {};
      Object.entries(obj).forEach(([key, value]) => (newObj[key] = Item.copy(value)));
      return newObj;
    }
  };
  constructor(data) {
    Object.entries(data).forEach(([key, value]) => {
      this[key] = value; //Item.copy(value);
    });
  }
}
