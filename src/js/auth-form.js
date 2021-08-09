import authorizationFormTpl from '../templates/authorization-form.hbs';
import { openModal, closeModal } from './modal-control';

const openBtn = document.querySelectorAll('.header__account-link');
openBtn.forEach(e => e.addEventListener('click', openAuthModal));

function openAuthModal() {
  openModal(authorizationFormTpl);
}

function onSubmit(params) {
  closeModal();
}
