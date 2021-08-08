export default {
  categories: null,
  events: {},

  setCategories(categories) {
      this.categories = categories;
      this.notify('categories', this.categories);
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
          events[e].notify(data);
      }
  }

}