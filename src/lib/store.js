// Это обьект, который хранит данные.
//С одной стороны изменяем данные (например store.setCategories),
// с другой реагируем на изменения вешая callback (например, store.register('categories', () => {}).

//Для добавления новых элементов в store с одной стороны добавляете новое свойство и сетер,
// с другой стороны вешаете callback

export default {
  events: {},

  categories: null,
  products: null,
  query: { categories: [], search: '' }, //, page: 1 }
  isOnline: false,
  heroData: null,

  // set(prop, value) {
  //   this[prop] = value;
  //   this.notify(prop, this[prop]);
  // },

  setCategories(categories) {
    this.categories = categories;
    this.notify('categories', this.categories);
  },

  setProducts(products) {
    this.products = products;
    this.notify('products', this.products);
  },

  setQuery(query) {
    //this.query = query;
    if (query === null) {
      this.query.categories = [];
      this.query.search = '';
    } else if (query.categories) {
      const alreadyExists = this.query.categories.indexOf(query.categories[0]);
      if (alreadyExists === -1) {
        this.query.categories.push(query.categories[0]);
      } else {
        this.query.categories.splice(alreadyExists, 1);
      }
    } else {
      Object.assign(this.query, query);
    }

    this.notify('query', this.query);
  },

  setIsOnline(isOnline) {
    this.isOnline = isOnline;
    this.notify('isOnline', this.isOnline);
  },

  setHeroData(heroData) {
    this.heroData = heroData;
    this.notify('heroData', this.heroData);
  },

  addEvent: function (name) {
    if (typeof this.events[name] === 'undefined') {
      this.events[name] = [];
    }
  },

  register: function (event, subscriber) {
    if (typeof subscriber === 'function') {
      this.addEvent(event);
      this.events[event].push(subscriber);
    }
  },

  notify: function (event, data) {
    const events = this.events[event];
    for (let e in events) {
      events[e](data, this);
    }
  },
};
