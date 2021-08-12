import Item from './item';
import Card from './card';
import Category from './category';

export default class Data extends Item {
  /**
   * @type {Category[]}
   */
  categoryList = [];

  /**
   *
   * @param {string} name
   * @param {string} link
   * @param {Card[]} cardList
   */
  addCategory(name, link, cardList) {
    this.categoryList.push(
      new Category({
        name,
        link,
        cardList,
      }),
    );
  }

  /**
   * @param {string} id
   * @returns {Card}
   */
  getCard(id) {
    for (const category of this.categoryList) {
      const card = category.getCard(id);
      if (card) return card;
    }
    return null;
  }

  /**
   * @param {string} name
   * @returns {Category}
   */
  getCategory(name) {
    return this.categoryList.find(category => category.origName === name);
  }

  /**
   *
   * @param {number} start
   * @param {number} length
   * @returns {Category[]}
   */
  getCategoryList(start = 0, length = Infinity) {
    return this.categoryList.slice(start, length);
  }

  /**
   * @param {string} query
   * @returns {Category[]}
   */
  filter(query) {
    if (!query) return this.getCategoryList();
    const filtered = [];
    for (const category of this.categoryList) {
      const catFiltered = category.filter(query);
      if (catFiltered.length) {
        filtered.push(
          new Category({
            name: category.name,
            cardList: catFiltered,
          }),
        );
      }
    }
    return filtered;
  }

  constructor(data) {
    super(data);
  }
}
