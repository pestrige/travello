// Slider

const swiperTours = new Swiper('.tours__slider', {
  slidesPerView: 'auto',
  loop: false,
  navigation: {
    nextEl: '.tours__slider-next',
    prevEl: '.tours__slider-prev',
  },
});

const swiperHotDeals = new Swiper('.hot-deals__slider', {
  slidesPerView: 'auto',
  loop: true,
});

// Mobile menu

const body = document.querySelector('.body');
const mainHeader = body.querySelector('.main-header');
const mainNav = mainHeader.querySelector('.main-nav__list');
const navToggle = mainHeader.querySelector('.main-nav__toggle');

const onWindowKeydown = (evt) => {
  if (evt.key === 'Esc' || evt.key === 'Escape') {
    evt.target.blur();
    hideMenu();
  }
};

const hideMenu = () => {
  const isAnimationNeeded = mainNav.classList.contains('main-nav__list--show-animation');
  body.classList.remove('no-scroll');
  mainNav.classList.remove('main-nav__list--shown-no-js');
  navToggle.classList.remove('main-nav__toggle--open');
  if (isAnimationNeeded) {
    mainNav.classList.remove('main-nav__list--show-animation');
    mainNav.classList.add('main-nav__list--hide-animation');
    mainNav.addEventListener('animationend',
      ()=> mainNav.classList.remove('main-nav__list--hide-animation'),
      {once: true});
  }
};

const showMenu = () => {
  body.classList.add('no-scroll');
  mainNav.classList.add('main-nav__list--show-animation');
  navToggle.classList.add('main-nav__toggle--open');
  window.addEventListener('keydown', onWindowKeydown);
};

const onNavToggleClick = (evt) => {
  evt.preventDefault();

  const isMenuShown = mainNav.classList.contains('main-nav__list--shown-no-js') || mainNav.classList.contains('main-nav__list--show-animation');

  if (isMenuShown) {
    hideMenu();
  } else {
    showMenu();
  }
};

hideMenu();

if (navToggle) {
  navToggle.addEventListener('click', onNavToggleClick);
}

// Fixed menu on scroll

const onWindowScroll = () => {
  const headerDoubleHeight = mainHeader.offsetHeight * 2;
  const scrolled = window.pageYOffset;
  const isHeaderFixed = mainHeader.classList.contains('main-header--fixed-in');

  if (scrolled > headerDoubleHeight) {
    mainHeader.classList.add('main-header--fixed-in');
  } else if (isHeaderFixed) {
    mainHeader.classList.remove('main-header--fixed-in');
    mainHeader.classList.add('main-header--fixed-out');
    mainHeader.addEventListener('animationend',
      ()=> mainHeader.classList.remove('main-header--fixed-out'),
      {once: true});
  }
};

window.addEventListener('scroll', onWindowScroll);

// Smooth Scroll to Anchor

const onMainNavClick = (evt) => {
  const anchorLink = evt.target.closest('a[href^="#"]');
  if (!anchorLink) {
    return false;
  }

  evt.preventDefault();
  const anchorBlock = document.querySelector(anchorLink.getAttribute('href'));
  const anchorBlockTop = anchorBlock.offsetTop;
  const currentPosition = window.pageYOffset;
  const scrollTo = anchorBlockTop - mainHeader.offsetHeight;

  const scrollDown = (h) => {
    let scrollY = h || currentPosition;

    if (scrollY < scrollTo) {
      setTimeout(() => {
        window.scrollTo(0, scrollY);
        scrollDown(scrollY + 10);
      }, 5)
    }
  };

  const scrollUp = (h) => {
    let scrollY = h || currentPosition;

    if (scrollY > scrollTo) {
      setTimeout(() => {
        window.scrollTo(0, scrollY);
        console.log(scrollY, window.pageYOffset);
        scrollUp(scrollY - 10);
      }, 5)
    }
  };

  if (mainNav.classList.contains('main-nav__list--show-animation')) {
    hideMenu();
  }
  currentPosition < scrollTo ? scrollDown() : scrollUp();
};

mainNav.addEventListener('click', onMainNavClick);
