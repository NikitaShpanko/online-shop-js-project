import Data from './data';
import Category from './category';

export default class UserData extends Data {
  constructor(data) {
    super(data);
    if (this.favourites) this.addCategory('favourite', '/profile/favourite', this.favourites);
    if (this.calls) this.addCategory('own', '/profile/own', this.calls);
  }
}
