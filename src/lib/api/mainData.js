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

  /**
   * @param  {...MainData} newMainData
   */
  append(...newMainData) {
    newMainData.forEach(mainData => {
      Object.entries(mainData).forEach(([key, value]) => {
        if (typeof this[key] === 'undefined') {
          this[key] = value;
        }
      });
      this.categoryList.push(...mainData.categoryList);
    });
    return this;
  }

  // filter(query, param = 'category') {
  //   if (!query) return this.getCategoryList();
  //   const categoryFilter = Item.filter(this.categoryList, query, 'name');
  //   const salesFilter = this.getCategory(config.specialCategory)?.filter(query, param);
  //   if (salesFilter?.length) {
  //     return [
  //       new Category({
  //         name: config.specialCategory,
  //         link: `/category/${config.specialCategory}`,
  //         cardList: salesFilter,
  //       }),
  //       ...categoryFilter,
  //     ];
  //   }
  //   return categoryFilter;
  // }
}
