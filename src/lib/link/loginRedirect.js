import goTo from './goTo';
import parse from './parse';
import setSearchParam from './setSearchParam';
export default function loginRedirect(where = location.href) {
  goTo(where ? setSearchParam('/login', 'redirect', parseRedirect(where)) : '/login');
}

function parseRedirect(link) {
  const linkData = parse(link);
  //console.log(linkData, location.href);
  return linkData.shortLink + (linkData.hash.length ? `#${linkData.hash}` : '');
}
