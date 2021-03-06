var slider = document.querySelector('.slider');
var prev = slider.querySelector('.slider__btn--prev');
var next = slider.querySelector('.slider__btn--next');
var slides = slider.querySelector('.slider__list').children;
var togglesList = slider.querySelector('.slider__toggles-list');
var toggles = togglesList.children;
var slidesCount = slides.length - 1;
var slideIndex = 0;

var removeSlide = function (index) {
  slides[index].classList.remove('slider__item--active');
  toggles[index].classList.remove('slider__toggle--active');
};

var setSlide = function (index) {
  slides[index].classList.add('slider__item--active');
  toggles[index].classList.add('slider__toggle--active');
};

var onSlideChange = function (evt) {
  evt.preventDefault();

  removeSlide(slideIndex);

  slideIndex = (evt.target.classList.contains('slider__btn--prev')) ? --slideIndex : ++slideIndex;

  if (slideIndex < 0) slideIndex = slidesCount;
  if (slideIndex > slidesCount) slideIndex = 0;

  setSlide(slideIndex);
};

prev.addEventListener('click', onSlideChange);
next.addEventListener('click', onSlideChange);

togglesList.addEventListener('click', function(evt) {
  evt.preventDefault();

  if (evt.target.type !== 'button') return;

  var currentIndex = evt.target.getAttribute('data-index');

  if (currentIndex == slideIndex) return;

  removeSlide(slideIndex);
  setSlide(currentIndex);
  slideIndex = currentIndex;
});


var mainNavList = document.querySelector('.main-nav__list');
var mainNavToggle = document.querySelector('.main-nav__toggle');

mainNavList.classList.remove('main-nav__list--no-js');

mainNavToggle.addEventListener('click', function (evt) {
  evt.preventDefault();

  mainNavList.classList.toggle('main-nav__list--open');
});


var histSlider = document.querySelector('.hist-slider');
var histSliderControls = histSlider.querySelector('.hist-slider__controls');
var activeToggle = histSliderControls.querySelector('.hist-slider__toggle--active');

histSliderControls.addEventListener('click', function(evt) {
  evt.preventDefault();
  
  if (evt.target.type !== 'button') return;
  
  activeToggle.classList.remove('hist-slider__toggle--active');
  
  evt.target.classList.add('hist-slider__toggle--active');
  histSliderControls.style.left += '30px';
  
  activeToggle = evt.target;
});
