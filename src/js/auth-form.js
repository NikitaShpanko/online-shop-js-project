import authorizationFormTpl from '../templates/authorization-form.hbs';
import confirmModal from '../templates/confirm-modal.hbs';
import { openModal, closeModal } from './modal-control';
import * as API from '../lib/api';
import store from '../lib/store';
import * as Link from '../lib/link';

const headerRegContiner = document.querySelectorAll('[data-account-registration]');
const headerCabContiner = document.querySelectorAll('[data-account-user]');

store.register('isOnline', isIt => {
  headerRegContiner.forEach(e => e.classList.toggle('reg-is-hidden'));
  headerCabContiner.forEach(e => e.classList.toggle('cab-is-hidden'));

  if (isIt) {
    const url = new URL(location.href);
    const redirect = url.searchParams.get('redirect');
    if (redirect) Link.goTo(redirect, false);
    else if (store.products) Link.goTo('/profile', false);
  } else if (store.products) {
    Link.goTo('/', false);
  }
});

(async () => {
  const url = new URL(document.location).searchParams;
  const urlToken = url.get('accessToken');

  if (urlToken) {
    localStorage.accessToken = urlToken;
    localStorage.refreshToken = url.get('refreshToken');
    localStorage.sid = url.get('sid');
  }

  if (localStorage.accessToken) {
    const userData = await API.request('/user', 'GET', false, localStorage.accessToken, true);
    if (userData.error) {
      deleteToken();
      return;
    }
    store.setIsOnline(userData);

    const body = { sid: localStorage.sid };
    const refToken = localStorage.refreshToken;

    const newTokenData = await API.request('/auth/refresh', 'POST', body, refToken, true);
    saveToken(newTokenData, true);
  }
})();

const headerListener = document.querySelector('header');
headerListener.addEventListener('click', userAccountControl);

function userAccountControl(e) {
  const controlBtn = e.target.closest('A');
  if (!controlBtn?.classList.contains('header__account-link')) {
    return;
  }

  e.preventDefault();
  if (controlBtn?.dataset.user === 'regAuth') {
    openAuthModal();
  }

  if (controlBtn?.dataset.user === 'exit') {
    confirmLogoutUser();
  }
}

export function openAuthModal() {
  openModal(authorizationFormTpl());
  const form = document.body.querySelector('.authorization-form');
  form.addEventListener('click', e => {
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

function confirmLogoutUser() {
  openModal(confirmModal());
  document.body.querySelector('.modal-confirm').addEventListener('click', e => {
    if (!e.target.closest('Button')?.classList.contains('confirm__button')) {
      return;
    }
    if (+e.target.dataset.confirm) {
      logoutUser();
      console.log('Вы успешно вышли из акаунта');
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

async function onAuthBtnClick(obj) {
  const data = await authUser(obj);

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
  if (dataReg.error === 409) {
    console.log('Пользователь с таким "email" уже существует');
  } else if (dataReg.id) {
    const dataAuth = await authUser(obj);

    console.log('Пользователь зарегистрирован и авторизирован');
    store.setIsOnline(dataAuth);
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
