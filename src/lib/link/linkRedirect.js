import goTo from './goTo';
export default function linkRedirect(where) {
  goTo(where ? setSearchParam('/login', 'redirect', where) : '/login');
}
