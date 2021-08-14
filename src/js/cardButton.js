import modalCard from '../templates/modal-card.hbs';
import authorizationFormTpl from '../templates/authorization-form.hbs';
import modalAdvertEditTpl from '../templates/new-modal-advert-edit.hbs';
import { openModal, closeModal } from './modal-control';
import * as API from '../lib/api';
import store from '../lib/store';

const bodyNode = document.querySelector('body');

bodyNode.addEventListener('click', e => {
  const buttonClick = e.target.closest('button');
  const cardId = e.target.closest('.card__article');
  const cardIdModal = e.target.closest('.modal-card-conteiner');
  const formIdModal = e.target.closest('.form-modal-adv');
  const cardModalPatsh = e.target.closest('.form-modal-push');
  const cardModalDelete = e.target.closest('.form-modal-edit');
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
      const getUserId = cardId.dataset.userid;
      const getId = cardId.dataset.id;
      const infoUser = store.isOnline;
      const data = store.products.getCard(getId);

      if (infoUser.id === getUserId) openModal(modalAdvertEditTpl({ data }));
      else openModalCard(cardId.dataset.id);
      // user().then(e => {
      //   if (e.id === getUserId) openModal(modalAdvertEditTpl({ data }));
      //   else openModalCard(cardId.dataset.id);
      // });
    } else if (buttonClick.classList.contains('modal-card--bnInfo')) {
      e.target.classList.toggle('isDispleyNone');
      document.querySelector('.modal-card--userInfo').classList.toggle('isDispleyNone');
    } else if (buttonClick.classList.contains('modal-card--buttonToShare'))
      console.log('Поделиться товаром с друзьями чере социальные сети (допустим)');
  }

  if (cardId && buttonClick?.nodeName !== 'BUTTON') {
    const getUserId = cardId.dataset.userid;
    const getId = cardId.dataset.id;
    const infoUser = store.isOnline;
    const data = store.products.getCard(getId);

    if (infoUser.id === getUserId) openModal(modalAdvertEditTpl({ data }));
    else openModalCard(cardId.dataset.id);
  }
  if (cardModalDelete) {
    const id = formIdModal.dataset.id;
    deleteCard(id);
  }

  if (cardModalPatsh) {
    const id = cardId.dataset.id;
    let form = document.createElement('.form-modal-adv');
    console.log(form);
    console.log(form.submit());
    patshCard(form.submit(), id);
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

// function updateURL(url) {
//   if (history.pushState) {
//     const baseUrl =
//       window.location.protocol + '//' + window.location.host + window.location.pathname;
//     const newUrl = baseUrl + url;
//     history.pushState(null, null, newUrl);
//   }
// }

async function user() {
  return API.request(`/user`, 'GET', false, localStorage.accessToken);
}

async function patshCard(getCard, id) {
  return API.request(`/call/${id}`, 'POST', getCard, localStorage.accessToken);
  closeModal(modalAdvertEditTpl);
}

async function deleteCard(id) {
  const data = await API.request(`/call/${id}`, 'DELETE', false, localStorage.accessToken, false);
  closeModal(modalAdvertEditTpl);
}
