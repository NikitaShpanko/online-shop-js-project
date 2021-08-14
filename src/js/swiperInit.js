import Swiper from 'swiper/bundle';

export default function swiperInit() {
  document.querySelector('#root').addEventListener('click', e => {
    const button = e.target.closest('button');
    if (!button || !button.dataset.action) return;
    const container = button.closest('.categories__container');
    const swiper = container.querySelector('.swiper-container').swiper;

    if (button.dataset.action === 'right') {
      swiper.slideNext();
      if (swiper.isEnd) button.style.display = 'none';
      container.querySelector('[data-action="left"]').style.display = '';
    }
    if (button.dataset.action === 'left') {
      swiper.slidePrev();
      if (swiper.isBeginning) button.style.display = 'none';
      container.querySelector('[data-action="right"]').style.display = '';
    }

    console.log(`B: ${swiper.isBeginning}, E: ${swiper.isEnd}`);
  });
}
