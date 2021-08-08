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

  setPage(shownCategory) {
    this.shownCategory = shownCategory
    this.notify('shownCategory', this.shownCategory);
  },

  addEvent: function(name) {
      if (typeof this.events[name] === "undefined") {
          this.events[name] = [];
      }
  },

  register: function(event, subscriber) {
      if (typeof subscriber === "object" && typeof subscriber.notify === 'function') {
          this.addEvent(event);
          this.events[event].push(subscriber);
      }
  },

  notify: function(event, data) {
      var events = this.events[event];
      for (var e in events) {
          events[e].notify(data, this);
      }
  }

}