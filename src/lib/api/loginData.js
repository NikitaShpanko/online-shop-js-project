import Data from './data';

export default class LoginData extends Data {
  constructor(data) {
    super(data);
    if (!this.user) return;
    this.addCategory('favourite', '/home/favourite', this.user.favourites);
    this.addCategory('own', '/home/own', this.user.calls);
  }
}
