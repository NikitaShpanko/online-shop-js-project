import authorizationFormTpl from '../templates/authorization-form.hbs';
import confirmModal from '../templates/confirm-modal.hbs';
import { openModal, closeModal } from './modal-control';
import * as API from '../lib/api';
import store from '../lib/store';
import { loadJSON, saveJSON } from '../lib/use-json';

if (localStorage.accessToken) {
  store.setIsOnline(loadJSON('userData'));
}

store.register('isOnline', storeIsOnline => {
  console.log('store', storeIsOnline);
  if (storeIsOnline) {
    // render home and logout
  } else {
    // render auth and reg
  }
});

const openBtn = document.querySelectorAll('.header__account-link');
openBtn.forEach(e => e.addEventListener('click', openAuthModal));

function openAuthModal(e) {
  e.preventDefault();
  openModal(authorizationFormTpl());
  const form = document.body.querySelector('.authorization-form');
  form.addEventListener('click', e => {
    e.preventDefault();

    const authBtn = e.target.closest('Button')?.classList.contains('button-auth');
    const regBtn = e.target.closest('Button')?.classList.contains('button-registration');

    if (!authBtn && !regBtn) return;

    let isValid = true;
    const obj = {};
    form.querySelectorAll('input').forEach(i => {
      obj[i.name] = i.value;
      if (!i.validity.valid) {
        isValid = false;
      }
    });

    if (!isValid) {
      return;
    }

    if (authBtn) {
      onAuthBtnClick(obj);
    }
    if (regBtn) {
      onRegBtnClick(obj);
    }
  });
}

async function onAuthBtnClick(obj) {
  const data = await authUser(obj);
  // console.log(data);
  if (data.error === 403) {
    console.log('Ошибка авторизации, Неверный пароль или логин');
  } else if (data.user.id) {
    console.log('Пользователь авторизирован');
    store.setIsOnline(data);
    saveToken(data);
    closeModal();
  }
}

async function onRegBtnClick(obj) {
  const dataReg = await regUser(obj);
  // console.log(dataReg);
  if (dataReg.error === 409) {
    console.log('Пользователь с таким "email" уже существует');
    // console.log(dataReg);
  } else if (dataReg.id) {
    // console.log(dataReg.id);
    const userId = dataReg.id;
    const dataAuth = await authUser(obj);
    console.log('Пользователь авторизирован и зарегистрирован');
    store.setIsOnline(dataAuth);
    saveToken(dataAuth);
    closeModal();
  }
}

function saveToken(data) {
  localStorage.accessToken = data.accessToken;
  localStorage.refreshToken = data.refreshToken;
  saveJSON('userData', data);
}

function deleteToken() {
  localStorage.accessToken = '';
  localStorage.refreshToken = '';
  localStorage.userData = '';
}

function regUser(obj) {
  return API.request('/auth/register', 'POST', obj);
}

function authUser(obj) {
  return API.request('/auth/login', 'POST', obj);
}

// ============================ LogoutUser ======================================

const btnExit = document.querySelector('.primary-button');
btnExit.addEventListener('click', confirmLogoutUser);

function confirmLogoutUser() {
  if (!localStorage.accessToken) {
    return;
  }
  openModal(confirmModal());
  document.body.querySelector('.modal-confirm').addEventListener('click', e => {
    if (!e.target.closest('Button')?.classList.contains('confirm__button')) {
      return;
    }
    if (+e.target.dataset.confirm) {
      logoutUser();
      closeModal();
    } else {
      closeModal();
    }
  });
}

function logoutUser() {
  API.request('/auth/logout', 'POST', false, localStorage.accessToken, false).then(data => {
    if (data.status === 204) {
      // console.log(data);
      store.setIsOnline(false);
      deleteToken();
    }
  });
}
