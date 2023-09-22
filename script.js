'use strict';

///////////////////////////////////////
// Selectors

// Modal Window
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

// Cookies
const header = document.querySelector('.header');

// Scrolling
const btnScroll = document.querySelector('.btn--scroll-to');
const section1 = document.getElementById('section--1');

// Tabbed Component
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

// Nav
const nav = document.querySelector('.nav');

// Sections
const allSections = document.querySelectorAll('.section');

// Lazy loading images
const images = document.querySelectorAll('img[data-src]');

// Slider
const slides = document.querySelectorAll('.slide');
const btnPrev = document.querySelector('.slider__btn--left');
const btnNext = document.querySelector('.slider__btn--right');
const dotsContainer = document.querySelector('.dots');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  // Prevent from scrolling up
  e.preventDefault();

  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Cookies

const cookieMessage = document.createElement('div');
cookieMessage.classList.add('cookie-message');
cookieMessage.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

header.append(cookieMessage);

document.querySelector('.btn--close-cookie').addEventListener('click', function () {
  // Old way with DOM traversing
  // cookieMessage.parentNode.removeChild(cookieMessage);
  cookieMessage.remove();
});

///////////////////////////////////////
// Scrolling

btnScroll.addEventListener('click', function (e) {
  // const s1Coords = section1.getBoundingClientRect();

  // window.scrollTo({
  //   left: s1Coords.left + window.pageXOffset,
  //   top: s1Coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });
  section1.scrollIntoView({
    behavior: 'smooth',
  });
});

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();

//     const id = this.getAttribute('href');
//     const section = document.querySelector(id);
//     section.scrollIntoView({
//       behavior: 'smooth',
//     });
//   });
// });

document.querySelector('.nav__links').addEventListener('click', function (e) {
  if (e.target.classList.contains('nav__link')) {
    e.preventDefault();

    const id = e.target.getAttribute('href');
    const section = document.querySelector(id);
    section.scrollIntoView({
      behavior: 'smooth',
    });
  }
});

///////////////////////////////////////
// Tabbed component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) {
    return;
  }

  // Activate tab
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  // Activate content area
  tabsContent.forEach(tabContent => tabContent.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////
// Menu fade animation

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      // Arrow function inherits "this" keyword from the event handler!!!
      if (el !== link) {
        el.style.opacity = this;
      }
    });

    logo.style.opacity = this;
  }
};

// Passing "argument/s" into handler
// mouseover/out bubble, mouseenter/leave do not
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////
// Sticky navigation

// With the scroll event
// const initCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function () {
//   if (window.scrollY > initCoords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

// A better way - Intersection observer API

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries, observer) {
  const [entry] = entries;

  if (entry.isIntersecting) {
    nav.classList.remove('sticky');
  } else {
    nav.classList.add('sticky');
  }
};

const headerOptions = {
  root: null, // intersection with the viewport
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

const headerObserver = new IntersectionObserver(stickyNav, headerOptions);
headerObserver.observe(header);

///////////////////////////////////////
// Sections reveal animation

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (entry.isIntersecting) {
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  }
};

const sectionOptions = {
  root: null, // intersection with the viewport
  threshold: 0.15,
};

const sectionObserver = new IntersectionObserver(revealSection, sectionOptions);

allSections.forEach(function (section) {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

///////////////////////////////////////
// Lazy loading images

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    return;
  }

  const img = entry.target;

  img.src = img.dataset.src;

  img.addEventListener('load', function () {
    img.classList.remove('lazy-img');
  });

  observer.unobserve(img);
};

const imgOptions = {
  root: null, // intersection with the viewport
  threshold: 0,
  rootMargin: '200px',
};

const imgObserver = new IntersectionObserver(loadImg, imgOptions);

images.forEach(img => imgObserver.observe(img));

///////////////////////////////////////
// Slider

const goToSlide = function (targetSlide) {
  slides.forEach(function (slide, index) {
    slide.style.transform = `translateX(${100 * (index - targetSlide)}%)`;
  });
};

let currSlide = 0;
const maxSlide = slides.length;

// Dots

const addDots = function () {
  for (let i = 0; i < slides.length; ++i) {
    const dotHTML = `<button class="dots__dot" data-slide=${i}></button>`;
    dotsContainer.insertAdjacentHTML('beforeend', dotHTML);
  }
};

const switchDotState = function (slide) {
  const dot = document.querySelector(`button[data-slide="${slide}"]`);

  if (dot.classList.contains('dots__dot--active')) {
    dot.classList.remove('dots__dot--active');
  } else {
    dot.classList.add('dots__dot--active');
  }
};

const init = function () {
  addDots();
  switchDotState(0);
  goToSlide(0);
};

init();

// document.querySelectorAll('.dots__dot').forEach(function (dot, index) {
//   dot.addEventListener('click', function () {
//     switchDotState(currSlide);
//     currSlide = index;
//     switchDotState(currSlide);
//     goToSlide(currSlide);
//   });
// });

// Better with event delegation
dotsContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const dotIndex = e.target.dataset.slide;

    switchDotState(currSlide);
    currSlide = dotIndex;

    switchDotState(currSlide);
    goToSlide(currSlide);
  }
});

const prevSlide = function () {
  // if (currSlide === 0) {
  //   currSlide = maxSlide - 1;
  // } else {
  //   currSlide -= 1;
  // }

  switchDotState(currSlide);
  currSlide = (currSlide - 1 + maxSlide) % maxSlide;

  switchDotState(currSlide);
  goToSlide(currSlide);
};

const nextSlide = function () {
  // if (currSlide === maxSlide - 1) {
  //   currSlide = 0;
  // } else {
  //   currSlide += 1;
  // }

  switchDotState(currSlide);
  currSlide = (currSlide + 1) % maxSlide;

  switchDotState(currSlide);
  goToSlide(currSlide);
};

// Buttons
btnPrev.addEventListener('click', prevSlide);
btnNext.addEventListener('click', nextSlide);

// Keys
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') {
    prevSlide();
  }

  if (e.key === 'ArrowRight') {
    nextSlide();
  }
});
