import authorizationFormTpl from '../templates/authorization-form.hbs';
import { openModal, closeModal } from './modal-control';
import { request } from '../lib/api';

const openBtn = document.querySelectorAll('.header__account-link');
openBtn.forEach(e => e.addEventListener('click', openAuthModal));

function openAuthModal() {
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
      console.log(i.name, i.validity.valid);
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
    const token = data.accessToken;
    localStorage.token = token;
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
    console.log('Пользователь авторизирован');
    const token = dataAuth.accessToken;
    localStorage.token = token;
    closeModal();
  }
}

function regUser(obj) {
  return request('/auth/register', 'POST', obj);
}

function authUser(obj) {
  return request('/auth/login', 'POST', obj);
}

// const obj = {
//   email: 'user31232@example.com',
//   password: 'qwerty123',
// };
// request('/auth/login', 'POST', obj).then(data => {
//   const token = data.accessToken;
//   localStorage.token = token;
//   console.log(data);
// });

//request('/auth/login', 'POST', obj).then(console.log);

// const obj = {
//   accessToken: localStorage.token,
// };
// console.log(obj.accessToken);
// request('/auth/logout', 'POST', obj).then(data => {
//   // const token = data.accessToken;
//   // localStorage.token = token;
//   console.log(data);
// });
