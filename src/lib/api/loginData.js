import Data from './data';

export default class LoginData extends Data {
  constructor(data) {
    super(data);
    if (!this.user) return;
    this.addCategory('favourite', '/profile/favourite', this.user.favourites);
    this.addCategory('own', '/profile/own', this.user.calls);
  }
}
