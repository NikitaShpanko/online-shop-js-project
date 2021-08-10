import Item from './item';
import Data from './data';
import Card from './card';

export default class Category extends Data {
  /**
   * @type {string}
   */
  name;
  /**
   * @type {string}
   */
  link;
  /**
   * @type {Card[]}
   */
  card;
  /**
   * @param {Category} data
   */
  constructor(data) {
    super(data);
  }
  #getCard(id) {
    for (const item of this.card) {
      if (item._id === id) return item;
    }
    return null;
  }
  #getCardList(start, length) {
    //return
  }
  #getCategory(name) {
    if (name === this.name) return this;
    return null;
  }
  #getCategoryList(start, length) {
    return [this];
  }
  #filter(categories) {
    categories.split(',').forEach(category => {
      if (this.name === category) return this;
    });
    return null;
  }
}
