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
  const cardModalPatch = e.target.closest('.form-modal-push');
  const cardModalDelete = e.target.closest('.form-modal-edit');
  const imgPrev = e.target.closest('.modal-card--poiner');

  if (buttonClick?.nodeName === 'BUTTON') {
    if (buttonClick.classList.contains('icon-heart-white')) {
      if (!localStorage.accessToken) return openModal(authorizationFormTpl());
      const getCardId = cardId.dataset.id;
      buttonClick.classList.toggle('isFavorites');
      if (buttonClick.classList.contains('isFavorites')) postIsFavoritesCard(getCardId);
      else deleteIsFavoritesCard(getCardId);

      const card = store.products.getCard(getCardId);
      card.isFavorites = !card.isFavorites;
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

    if (infoUser.id === getUserId) {
      openModal(modalAdvertEditTpl({ data }));
      const advForm = document.querySelector('.form-modal-adv');
      const imgInput = document.querySelector('.containerImgg_inp');
      const containerImg = document.querySelector('.containerImg');

      advForm.addEventListener('submit', e => {
        e.preventDefault();
        const id = advForm.dataset.id;
        const formData = new FormData(e.target);
        console.log(formData.get('title'));
        fet(id, formData);
      });
      imgInput.addEventListener('change', e => {
        if (containerImg.children.length < 6) {
          if (!e.target.files.length) return;
          const files = Array.from(e.target.files);

          files.forEach(file => {
            if (!file.type.match('image')) return;

            const reader = new FileReader();

            reader.onload = ev => {
              const src = ev.target.result;
              containerImg.insertAdjacentHTML(
                'afterbegin',
                `<div class="containerImgg"> <img src="${src}" alt="${file.name}" class="newImg"/> </div>`,
              );
            };
            reader.readAsDataURL(file);
          });
        }
      });
    } else openModalCard(cardId.dataset.id);
  }
  if (cardModalDelete) {
    const id = formIdModal.dataset.id;
    deleteCard(id);
  }

  // if (cardModalPatch) {
  //   const id = cardId.dataset.id;
  //   let form = document.createElement('.form-modal-adv');
  //   console.log(form);
  //   console.log(form.submit());
  //   patshCard(form.submit(), id);
  // }

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

// function onSubmit(params) {
//   closeModal();
// }

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

// async function patshCard(id, getCard) {
//   const data = await API.request(
//     `/call/${id}`,
//     'PATCH',
//     getCard,
//     localStorage.accessToken,
//     true,
//     false,
//   );
//   closeModal();
// }

async function fet(id, getCard) {
  await fetch(`https://callboard-backend.goit.global/call/${id}`, {
    method: 'PATCH',
    body: getCard,
    headers: {
      Accept: '*/*',
      Authorization: `Bearer ${localStorage.accessToken}`,
    },
  })
    .then(r => r.json())
    .then(data => {
      if (data.id) {
        console.log('Обьявление добавлено');
        closeModal();
      }
    })
    .catch(e => {
      console.log(e);
    });
}

async function deleteCard(id) {
  const data = await API.request(`/call/${id}`, 'DELETE', false, localStorage.accessToken, false);
  closeModal(modalAdvertEditTpl);
}

// function onSubmit(e) {
//   e.preventDefault();
//   console.log(advForm);
//   const id = advForm.dataset.id;
//   console.log(id);

//   const formData = new FormData(e.target);
//   patshCard(id, formData);
// }
