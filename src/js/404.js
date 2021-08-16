// import { goTo } from '../lib/link';
console.log('HEY!');

//const ourHref = location.href;
location.href = './index.html?redir=' + encodeURI(location.href);
// document.addEventListener('load', () => {
//   Link.goTo(ourHref);
// });
//Link.goTo(ourHref);
