import store from '../store';
import * as API from '../api';

/**
 * @param {string[]} pathList
 * @param {boolean} refreshOnline
 */
export async function syncHearts(pathList, refreshOnline) {
  if (!store.isOnline) return;
  if (pathList.includes('favourite')) {
    store.products.cardList.forEach(card => {
      card.isFavorites = true;
    });
    document.querySelectorAll('.icon-heart-white').forEach(iconHeart => {
      iconHeart.classList.add('isFavorites');
    });
    return;
  }

  let favCategory;
  if (pathList.includes('profile') && !refreshOnline) {
    favCategory = store.isOnline.getCategory('favourite');
  } else {
    favCategory = await API.get.request('​/call/favourites', localStorage.accessToken);
  }
  favCategory.cardList
    .map(card => card._id)
    .forEach(id => {
      const card = store.products.getCard(id);
      if (card) card.isFavorites = true;

      const cardElement = document.querySelector(`[data-id="${id}"]`);
      if (cardElement) {
        const iconHeart = cardElement.querySelector('.icon-heart-white');
        if (iconHeart) {
          iconHeart.classList.add('isFavorites');
        }
      }
    });
}
