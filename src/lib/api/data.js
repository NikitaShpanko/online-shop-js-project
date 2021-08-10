import Item from './item';
import Card from './card';

export default class Data extends Item {
  #getCard;
  #getCardList;
  #getCategory;
  #getCategoryList;
  #filter;
  /**
   * @param {string} id
   * @returns {Card}
   */
  getCard(id) {
    return this.#getCard(id);
  }

  /**
   * @param {string} name
   * @returns {Card[]}
   */
  getCardList(start = 0, length = Infinity) {
    return this.#getCardList(start, length);
  }

  /**
   * @param {string} name
   * @returns {Data}
   */
  getCategory(name) {
    return this.#getCategory(name);
  }

  /**  */
  getCategoryList(start = 0, length = Infinity) {
    return this.#getCategoryList(start, length);
  }

  /**
   * @param {string} query
   * @returns {Data}
   */
  filter(categories) {
    if (categories) return this.#filter(categories);
    else return this;
  }

  constructor(data) {
    super(data);
  }
}
