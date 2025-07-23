import { renderPhotos } from './addpreview.js';
import { request } from './fetch.js';
import { showError } from './alerts.js';
import { shuffleArray, debounce } from './util.js';
import './editor.js';
import './effects.js';
import './validation.js';

const DEFAULT_PREVIEW_LOAD = 25;
const RANDOM_PREVIEW_LOAD = 10;

const filter = document.querySelector('.img-filters');
let photos = [];

const removeActiveClass = () => {
  let activeFilter = document.querySelector('.img-filters__button--active');
  activeFilter.classList.remove('img-filters__button--active');
}

const removePhotos = () => {
  const images = document.querySelectorAll('.picture');
  if (images) {
    images.forEach(element => {
      element.remove();
    });
  }
}

const filters = {
  'filter-default': () => {
    renderPhotos(photos.slice(0, DEFAULT_PREVIEW_LOAD))
  },
  'filter-random': () => {
    renderPhotos(shuffleArray(photos.slice()).slice(0, RANDOM_PREVIEW_LOAD));

  },
  'filter-discussed': () => {
    renderPhotos(photos.slice().sort((a, b) => {
      return b.comments.length - a.comments.length;
    }))
  },
}

const onSuccess = (data) => {
  filter.classList.remove('img-filters--inactive');
  photos = data.slice()
  renderPhotos(photos.slice(0, DEFAULT_PREVIEW_LOAD))
}

const onError = () => {
  showError('Ошибка загрузки, попробуйте еще раз', 'Закрыть')
}

request(onSuccess, onError, 'GET')

const onFilterClick = debounce((evt) => {
  if (evt.target.classList.contains('img-filters__button')) {
    removeActiveClass();
    removePhotos();
    evt.target.classList.add('img-filters__button--active')
    filters[evt.target.id]()
  }
})

filter.addEventListener('click', onFilterClick)
