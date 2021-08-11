import Data from './data';
import Category from './category';
import Item from './item';
import config from '../../config.json';

export default class MainData extends Data {
  constructor(data) {
    super(data);
    Object.entries(data).forEach(([key, value]) => {
      this.addCategory(key, `/category/${key}`, value);
    });
  }
  filter(query, param = 'category') {
    if (!query) return this.getCategoryList();
    const categoryFilter = Item.filter(this.categoryList, query, 'name');
    const salesFilter = this.getCategory(config.specialCategory)?.filter(query, param);
    if (salesFilter?.length) {
      return [
        new Category({
          name: config.specialCategory,
          link: `/category/${config.specialCategory}`,
          cardList: salesFilter,
        }),
        ...categoryFilter,
      ];
    }
    return categoryFilter;
  }
}
