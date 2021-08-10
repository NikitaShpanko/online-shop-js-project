import authorizationFormTpl from '../templates/authorization-form.hbs';
import { openModal, closeModal } from './modal-control';
import * as API from '../lib/api';

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
  console.log(data);
  if (data.error === 403) {
    console.log('Ошибка авторизации, Неверный пароль или логин');
  } else if (data.user.id) {
    console.log('Пользователь авторизирован');
    saveToken(data);
    closeModal();
  }
}

async function onRegBtnClick(obj) {
  const dataReg = await regUser(obj);
  console.log(dataReg);
  if (dataReg.error === 409) {
    console.log('Пользователь с таким "email" уже существует');
    console.log(dataReg);
  } else if (dataReg.id) {
    console.log(dataReg.id);
    const userId = dataReg.id;
    const dataAuth = await authUser(obj);
    console.log('Пользователь авторизирован и зарегистрирован');
    saveToken(dataAuth);
    closeModal();
  }
}

function saveToken(data) {
  localStorage.accessToken = data.accessToken;
  localStorage.refreshToken = data.refreshToken;
}

function deleteToken() {
  localStorage.accessToken = '';
  localStorage.refreshToken = '';
}

function regUser(obj) {
  return API.request('/auth/register', 'POST', obj);
}

function authUser(obj) {
  return API.request('/auth/login', 'POST', obj);
}

// ============================ TEST ======================================

const btnExit = document.querySelector('.primary-button');
btnExit.addEventListener('click', logoutUser);

function logoutUser() {
  // if (!localStorage.refreshToken) {
  //   return;
  // }
  API.request('/auth/logout', 'POST', '', localStorage.accessToken, false).then(data => {
    console.log(data);
    if (data.status === 204) {
      console.log(data);
      deleteToken();
      console.log(localStorage.accessToken);
    }
  });
  // fetch('https://callboard-backend.goit.global/auth/logout', {
  //   method: 'POST',
  //   headers: {
  //     Authorization: `Bearer ${localStorage.accessToken}`,
  //   },
  // })
  //   .then(data => {
  //     if (data.status === 204) {
  //       console.log(data);
  //       deleteToken();
  //       console.log(localStorage.accessToken);
  //     }
  //   })
  //   .catch(e => console.log('error', e));
}
