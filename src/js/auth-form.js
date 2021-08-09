import authorizationFormTpl from '../templates/authorization-form.hbs';
import { openModal, closeModal } from './modal-control';
import { request } from '../lib/api';

const openBtn = document.querySelectorAll('.header__account-link');
openBtn.forEach(e => e.addEventListener('click', openAuthModal));

function openAuthModal() {
  openModal(authorizationFormTpl());
  document.body.querySelector('.authorization-form').addEventListener('submit', onAuthModalSubmit);
}

// function onAuthModalSubmit() {}

const obj = {
  email: 'testSubh@gmail.com',
  password: 'Qwerty12',
};

request('/auth/login', 'POST', obj).then(console.log);
