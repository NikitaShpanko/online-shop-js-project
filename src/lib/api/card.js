import Item from './item';

export default class Card extends Item {
  static tpl;
  /**
   * @type {string[]}
   */
  imgUrl;
  /**
   * @type {string}
   */
  _id;
  /**
   * @type {string}
   */
  title;
  /**
   * @type {string}
   */
  description;
  /**
   * @type {number}
   */
  price;
  /**
   * @type {string}
   */
  phone;
  /**
   * @type {string}
   */
  category;
  /**
   * @type {boolean}
   */
  isOnSale;
  /**
   * @type {string}
   */
  userId;
  /**
   * @type {number}
   */
  __v;
  /**
   * @type {number}
   */
  discountPercents;
  /**
   * @type {number}
   */
  oldPrice;
  /**
   * @param {Card} data
   */
  constructor(data) {
    super(data);
  }
}
