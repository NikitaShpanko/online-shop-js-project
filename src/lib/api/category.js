import Item from './item';
import Card from './card';

export default class Category extends Item {
  constructor(data) {
    super(data);
    if (this.cardList && !this.card) {
      this.card = Card.tpl(this.cardList);
    }
  }
  getCard(id) {
    for (const item of this.cardList) {
      if (item._id === id) return item;
    }
    return null;
  }
  getCardList(start = 0, length = Infinity) {
    return this.cardList.slice(start, length);
  }
}
