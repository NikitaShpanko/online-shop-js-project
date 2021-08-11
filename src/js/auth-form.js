import authorizationFormTpl from '../templates/authorization-form.hbs';
import confirmModal from '../templates/confirm-modal.hbs';
import { openModal, closeModal } from './modal-control';
import * as API from '../lib/api';
import store from '../lib/store';

store.register('isOnline', storeIsOnline => {
  // console.log('store', storeIsOnline);
  if (storeIsOnline) {
    // render home and logout
  } else {
    // render auth and reg
  }
});

(async () => {
  const accToken = localStorage.accessToken;
  if (accToken) {
    const userData = await API.request('/user', 'GET', false, accToken, true);
    store.setIsOnline(new API.LoginData(userData));

    const body = { sid: localStorage.sid };
    const refToken = localStorage.refreshToken;
    const newTokenData = await API.request('/auth/refresh', 'POST', body, refToken, true);
    saveToken(newTokenData, true);
  }
})();

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

  if (data.error === 403) {
    console.log('Ошибка авторизации, Неверный пароль или логин');
  } else if (data.user.id) {
    console.log('Пользователь авторизирован');
    store.setIsOnline(new API.LoginData(data.user));
    saveToken(data);
    closeModal();
  }
}

async function onRegBtnClick(obj) {
  const dataReg = await regUser(obj);
  if (dataReg.error === 409) {
    console.log('Пользователь с таким "email" уже существует');
  } else if (dataReg.id) {
    const dataAuth = await authUser(obj);
    console.log('Пользователь зарегистрирован и авторизирован');
    store.setIsOnline(new API.LoginData(dataAuth.user));
    saveToken(dataAuth);
    closeModal();
  }
}

function saveToken(data, ref = false) {
  localStorage.accessToken = data[ref ? 'newAccessToken' : 'accessToken'];
  localStorage.refreshToken = data[ref ? 'newRefreshToken' : 'refreshToken'];
  localStorage.sid = data[ref ? 'newSid' : 'sid'];
}

function deleteToken() {
  localStorage.accessToken = '';
  localStorage.refreshToken = '';
  localStorage.sid = '';
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
      store.setIsOnline(false);
      deleteToken();
    }
  });
}
