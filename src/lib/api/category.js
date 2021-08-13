import Item from './item';
import Card from './card';

export default class Category extends Item {
  constructor(data) {
    super(data);
    if (this.cardList && !this.card) {
      this.card = Card.tpl(this.cardList);
    }
    if (this.name) this.origName = this.name;
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
  filter(query) {
    if (!query) return this.getCardList();
    return Item.filter(this.cardList, query, 'category', true);
  }
}
