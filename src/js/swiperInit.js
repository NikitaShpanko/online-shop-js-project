export default function swiperInit() {
  document.querySelector('#root').addEventListener('click', e => {
    const button = e.target.closest('button');
    if (!button) return;
    if (button.dataset.action === 'right') {
      button
        .closest('.categories__container')
        .querySelector('.swiper-container')
        .swiper.slideNext();
    }

    if (button.dataset.action === 'left') {
      button
        .closest('.categories__container')
        .querySelector('.swiper-container')
        .swiper.slidePrev();
    }
  });
}
