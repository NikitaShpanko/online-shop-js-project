import Swiper from 'swiper/bundle';

export default function swiperInit() {
  const swiper = new Swiper('.swiper-container', {
    slidesPerView: 4,
    spaceBetween: 20,
    slidesPerGroup: 4,
    loopFillGroupWithBlank: true,
  
    breakpoints: {
      320: {
        slidesPerView: 1,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 22,
      },
      1280: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
    },
  });
  
  document.querySelector('#root').addEventListener('click', e => {
    const button = e.target.closest('button');
    if (!button) return;
    if (button.dataset.action === 'right') {
      button.closest('.categories__container').querySelector('.swiper-container').swiper.slideNext();
    }
  
    if (button.dataset.action === 'left') {
      button.closest('.categories__container').querySelector('.swiper-container').swiper.slidePrev();
    }
  });  
}