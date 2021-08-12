import modalCard from '../templates/modal-card.hbs';
import allCardCategoryTpl from '../templates/categories-allcard.hbs';
import cardCategoryTpl from '../templates/categories-allcard.hbs';
import { openModal, closeModal } from './modal-control';
import * as API from '../lib/api';
import store from '../lib/store';
import { from } from 'form-data';

const bodyNode = document.querySelector('body');

// console.log(bodyNode.querySelectorAll('.card__all--content'));

// const getIsFavoritesCard = API.request(
//   '/call/favourites',
//   'GET',
//   false,
//   localStorage.accessToken,
// ).then(id =>
//   id.cardList.forEach(card => {
//     console.log(card);
//   }),
// );

bodyNode.addEventListener('click', e => {
  const buttonClick = e.target.closest('button');
  const cardId = e.target.closest('.card__article');
  const cardIdModal = e.target.closest('.modal-card-conteiner');
  const imgPrev = e.target.closest('.modal-card--poiner');

  if (buttonClick?.nodeName === 'BUTTON') {
    if (buttonClick.classList.contains('icon-heart-white')) {
      const getCardId = cardId.dataset.id;
      buttonClick.classList.toggle('isFavorites');

      if (buttonClick.classList.contains('isFavorites')) {
        const postIsFavoritesCard = API.request(
          `/call/favourite/${getCardId}`,
          'POST',
          false,
          localStorage.accessToken,
        );
      } else {
        const deleteIsFavoritesCard = API.request(
          `/call/favourite/${getCardId}`,
          'DELETE',
          false,
          localStorage.accessToken,
        );
      }
    } else if (buttonClick.classList.contains('modal-card--buttonIsFavorite')) {
      const getCardId = cardIdModal.dataset.id;
      buttonClick.classList.toggle('isFavorites');

      if (buttonClick.classList.contains('isFavorites')) {
        const postIsFavoritesCard = API.request(
          `/call/favourite/${getCardId}`,
          'POST',
          false,
          localStorage.accessToken,
        );
      } else {
        const deleteIsFavoritesCard = API.request(
          `/call/favourite/${getCardId}`,
          'DELETE',
          false,
          localStorage.accessToken,
        );
      }
    } else if (buttonClick.classList.contains('icon-fullscreen')) openModalCard(cardId.dataset.id);
    else if (buttonClick.classList.contains('load__more--button'))
      console.log('Загрузка следующей страницы');
    else if (buttonClick.classList.contains('categories__titel--allCard')) {
      console.log('Загружается шаблон со всеми карточками');
    } else if (buttonClick.classList.contains('modal-card--bnInfo')) {
      e.target.classList.toggle('isDispleyNone');
      document.querySelector('.modal-card--userInfo').classList.toggle('isDispleyNone');
    } else if (buttonClick.classList.contains('modal-card--buttonToShare'))
      console.log('Поделиться товаром с дрзьями чере социальные сети (допустим)');
  }

  if (cardId && buttonClick?.nodeName !== 'BUTTON') {
    openModalCard(cardId.dataset.id);
  }

  if (imgPrev) {
    const imgSrcPrev = e.target.getAttribute('src');
    document.querySelector('.modal-card--imgCard').setAttribute('src', imgSrcPrev);
  }
});

function openModalCard(id) {
  //////////////////////////////////////////////////////
  ////  ЭТО ВРЕМЕННЫЙ КОСТЫЛЬ,  А ТО ОПЯТЬ СЛОМАЛОСЬ! //
  ////  КОГДА ПОДТЯНУ СВОЮ ЛОГИКУ, БУДЕТ СНОВА ПРОСТО //
  ////           store.products.getCard(id)           //
  //////////////////////////////////////////////////////
  const data = new API.MainData(store.products).getCard(id);
  //////////////////////////////////////////////////////
  const dataUserId = data.userId;

  const userIdObj = API.request(`/user/${dataUserId}`).then(id => {
    const obj = { ...data, ...id };
    data.userId;
    openModal(modalCard({ obj }));
  });
}

function onSubmit(params) {
  closeModal();
}
