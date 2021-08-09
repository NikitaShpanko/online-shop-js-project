// Это обьект, который хранит данные. 
//С одной стороны изменяем данные (например store.setCategories),
// с другой реагируем на изменения вешая callback (например, store.register('categories', () => {}).

//Для добавления новых элементов в store с одной стороны добавляете новое свойство и сетер,
// с другой стороны вешаете callback


export default {
  events: {},

  categories: null,
  products: null,
  page: null,
  shownCategory: null,

  setCategories(categories) {
      this.categories = categories;
      this.notify('categories', this.categories);
  },

  setProducts(products) {
    this.products = products;
    this.notify('products', this.products);
  },

  setPage(page) {
    this.page = page
    this.notify('page', this.page);
  },

  setShownCategory(shownCategory) {
    this.shownCategory = shownCategory
    this.notify('shownCategory', this.shownCategory);
  },

  addEvent: function(name) {
      if (typeof this.events[name] === "undefined") {
          this.events[name] = [];
      }
  },

  register: function(event, subscriber) {
      if (typeof subscriber === 'function') {
          this.addEvent(event);
          this.events[event].push(subscriber);
      }
  },

  notify: function(event, data) {
      const events = this.events[event];
      for (let e in events) {
          events[e](data, this);
      }
  }
}