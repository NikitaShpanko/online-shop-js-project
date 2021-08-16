import modal from '../templates/modal-students.hbs'
import { openModal, closeModal } from './modal-control';
document.querySelector('.btn-students').addEventListener('click', () => {
  openModal(modal())
})
