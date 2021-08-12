import modalCard from '../templates/modal-card.hbs';
import authorizationFormTpl from '../templates/authorization-form.hbs';
import { openModal, closeModal } from './modal-control';
import * as API from '../lib/api';
import store from '../lib/store';

const bodyNode = document.querySelector('body');

bodyNode.addEventListener('click', e => {
  const buttonClick = e.target.closest('button');
  const cardId = e.target.closest('.card__all--content');
  const cardIdModal = e.target.closest('.modal-card-conteiner');
  const imgPrev = e.target.closest('.modal-card--poiner');

  if (buttonClick?.nodeName === 'BUTTON') {
    if (buttonClick.classList.contains('icon-heart-white')) {
      if (!localStorage.accessToken) return openModal(authorizationFormTpl());
      const getCardId = cardId.dataset.id;
      buttonClick.classList.toggle('isFavorites');
      if (buttonClick.classList.contains('isFavorites')) postIsFavoritesCard(getCardId);
      else deleteIsFavoritesCard(getCardId);
    }

    if (buttonClick.classList.contains('modal-card--buttonIsFavorite')) {
      if (!localStorage.accessToken) {
        closeModal(modalCard());
        openModal(authorizationFormTpl());
      }
      const getCardId = cardIdModal.dataset.id;
      buttonClick.classList.toggle('isFavorites');
      if (buttonClick.classList.contains('isFavorites')) postIsFavoritesCard(getCardId);
      else deleteIsFavoritesCard(getCardId);
    }

    if (buttonClick.classList.contains('icon-fullscreen')) {
      updateURL('?card=modal');
      openModalCard(cardId.dataset.id);
    } else if (buttonClick.classList.contains('modal-card--bnInfo')) {
      e.target.classList.toggle('isDispleyNone');
      document.querySelector('.modal-card--userInfo').classList.toggle('isDispleyNone');
    } else if (buttonClick.classList.contains('modal-card--buttonToShare'))
      console.log('Поделиться товаром с дрзьями чере социальные сети (допустим)');
  }

  if (cardId && buttonClick?.nodeName !== 'BUTTON') {
    updateURL('?card=modal');
    openModalCard(cardId.dataset.id);
  }

  if (imgPrev) {
    const imgSrcPrev = e.target.getAttribute('src');
    document.querySelector('.modal-card--imgCard').setAttribute('src', imgSrcPrev);
  }
});

function openModalCard(id) {
  const data = store.products.getCard(id);
  const dataUserId = data.userId;

  const userIdObj = API.request(`/user/${dataUserId}`).then(id => {
    const obj = { ...data, ...id };
    openModal(modalCard({ obj }));
  });
}

function onSubmit(params) {
  closeModal();
}

async function postIsFavoritesCard(getCardId) {
  return API.request(`/call/favourite/${getCardId}`, 'POST', false, localStorage.accessToken);
}

async function deleteIsFavoritesCard(getCardId) {
  return API.request(`/call/favourite/${getCardId}`, 'DELETE', false, localStorage.accessToken);
}

function updateURL(url) {
  if (history.pushState) {
    const baseUrl =
      window.location.protocol + '//' + window.location.host + window.location.pathname;
    const newUrl = baseUrl + url;
    history.pushState(null, null, newUrl);
  }
}
