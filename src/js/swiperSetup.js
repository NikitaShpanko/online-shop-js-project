import Swiper from 'swiper/bundle';

export default function swiperSetup() {
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

    on: {
      slideChange: swiper => {
        const container = swiper.el.closest('.categories__container');
        container.querySelector('[data-action="left"]').style.display = swiper.isBeginning
          ? 'none'
          : '';
        container.querySelector('[data-action="right"]').style.display = swiper.isEnd ? 'none' : '';
      },
    },
  });

  document.querySelectorAll('.swiper-container').forEach(elem => {
    const swiper = elem.swiper;
    const container = elem.closest('.categories__container');
    container.querySelector('[data-action="left"]').style.display = 'none';
    if (swiper.isEnd) {
      container.querySelector('[data-action="right"]').style.display = 'none';
    }
  });
}
