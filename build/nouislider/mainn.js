const DESCRIPTIONS = [
  'Красивый пейзаж',
  'Закат на берегу моря',
  'Утренний кофе и хорошее настроение',
  'Городские огни ночью',
  'Горный вид завораживает',
  'Прекрасный день в парке',
];

const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
];

const NAMES = [
  'Макс',
  'Людмила',
  'Катя',
  'Игорь',
  'Сергей',
  'Саша',
  'Андрей',
  'Миша',
];


const randomUniqueNumberGenerator = (min, max) => {
  const uniqueArray = [];

  return () => {
    let currentNumber = _.random(min, max);

    if (uniqueArray.length >= (max - min + 1)) {
      throw new Error('Недостаточно уникальных чисел');
    }

    while (uniqueArray.includes(currentNumber)) {
      currentNumber = _.random(min, max);
    }

    uniqueArray.push(currentNumber);

    return currentNumber;
  }
}



const commentGenerator = () => {
  const uniqueCommentId = randomUniqueNumberGenerator(1, 9999);
  const randomAvatar = _.random(1, 6);
  const randomMessage = _.random(0, MESSAGES.length - 1);
  const randomName = _.random(0, NAMES.length - 1);

  return {
    id: uniqueCommentId(),
    avatar: 'img/avatar-' + randomAvatar + '.svg',
    message: MESSAGES[randomMessage],
    name: NAMES[randomName],
  }
}



const generateAllDescriptions = () => {
  const allDescriptions = [];

  // перемещаем сюда — генераторы будут чистыми при каждом вызове
  const uniqueId = randomUniqueNumberGenerator(1, 25);
  const uniqueUrl = randomUniqueNumberGenerator(1, 25);

  for (let i = 0; i < 25; i++) {
    const randomDescription = _.random(0, DESCRIPTIONS.length - 1);
    const randomLikes = _.random(15, 200);
    const numberOfComments = _.random(1, 10);
    const comments = Array.from({ length: numberOfComments }, commentGenerator);

    allDescriptions.push({
      id: uniqueId(),
      url: 'photos/' + uniqueUrl() + '.jpg',
      description: DESCRIPTIONS[randomDescription],
      likes: randomLikes,
      comments: comments,
    });
  }

  return allDescriptions;
};



const pictures = document.querySelector('.pictures');
const fragment = document.createDocumentFragment();

const renderPhoto = (photo) => {
  const photoTemplate = document.querySelector('#picture').content.querySelector('.picture');
  const photoElement = photoTemplate.cloneNode(true);
  const photoImage = photoElement.querySelector('.picture__img');
  const photoLikes = photoElement.querySelector('.picture__likes');
  const photoComments = photoElement.querySelector('.picture__comments');

  photoImage.src = photo.url;
  photoLikes.textContent = photo.likes;
  photoComments.textContent = photo.comments.length;
  photoImage.alt = photo.description;

  photoElement.dataset.photoId = photo.id;
  fragment.appendChild(photoElement);

  return photoElement;
};


const renderPhotos = async (photos) => {
  photos.forEach((photo) => {
    renderPhoto(photo);
  });

  pictures.appendChild(fragment);
};

const showFilters = () => {
  const filters = document.querySelector('.img-filters');
  filters.classList.remove('img-filters--inactive');
}

const allPhotos = generateAllDescriptions(); // <-- сохраняем результат
renderPhotos(allPhotos).then(showFilters); // отрисовываем



// фулскрин фото

const allPictures = document.querySelectorAll('.picture');
const fullscreen = document.querySelector('.big-picture');
const fullscreenOff = fullscreen.querySelector('.big-picture__cancel');
const fullscreenImg = fullscreen.querySelector('.big-picture__img img');
const fullscreenLikes = fullscreen.querySelector('.likes-count');
const fullscreenCommentsAmount = fullscreen.querySelector('.comments-count');
const fullscreenDescription = fullscreen.querySelector('.social__caption');
const fullscreenCommentsCount = fullscreen.querySelector('.social__comment-count');

const fullscreenComments = document.querySelector('.social__comments');
const fullscreenFragment = document.createDocumentFragment();

const renderComment = (comment) => {
  const fullscreenCommentTemplate = document.querySelector('#comment').content.querySelector('.social__comment');
  const commentSimilar = fullscreenCommentTemplate.cloneNode(true);

  commentSimilar.querySelector('.social__picture').src = comment.avatar;
  commentSimilar.querySelector('.social__picture').alt = comment.name;
  commentSimilar.querySelector('.social__text').textContent = comment.message;

  fullscreenFragment.appendChild(commentSimilar);

  return commentSimilar;
};

const renderComments = (comments) => {
  comments.forEach((comment) => {
    renderComment(comment);
  });

  fullscreenComments.appendChild(fullscreenFragment);
};



pictures.addEventListener('click', (evt) => {
  const picture = evt.target.closest('.picture');
  if (!picture) return;

  const photoId = Number(picture.dataset.photoId);
  const photo = allPhotos.find((p) => p.id === photoId); // <-- получили нужный объект

  if (!photo) return;

  fullscreen.classList.remove('hidden');
  document.body.classList.add('modal-open');

  fullscreenImg.src = photo.url;
  fullscreenImg.alt = photo.description;
  fullscreenLikes.textContent = photo.likes;
  fullscreenCommentsAmount.textContent = photo.comments.length;
  fullscreenDescription.textContent = photo.description;
  fullscreenCommentsCount.textContent = `${photo.comments.length} из ${photo.comments.length} комментариев`;

  fullscreenComments.innerHTML = ''; // очищаем
  renderComments(photo.comments);    // <-- передаём comments



  const allComments = document.querySelectorAll('.social__comment');
  const loadMoreBtn = document.querySelector('.comments-loader');
  let visibleCount = 0; // сколько комментариев уже показано

  // Скрываем все комментарии
  allComments.forEach(comment => comment.classList.add('hidden'));

  // Показываем кнопку
  loadMoreBtn.classList.remove('hidden');

  const showNextComments = () => {
    const nextCount = visibleCount + 5;

    for (let i = visibleCount; i < nextCount && i < allComments.length; i++) {
      allComments[i].classList.remove('hidden');
    }

    visibleCount = nextCount;

    // Если все комментарии показаны — скрываем кнопку
    if (visibleCount >= allComments.length) {
      loadMoreBtn.classList.add('hidden');
    }
  };

  // Показываем первые 5 сразу
  showNextComments();

  // Назначаем обработчик на кнопку
  loadMoreBtn.addEventListener('click', showNextComments);
});

fullscreenOff.addEventListener('click', (evt) => {
  evt.preventDefault();
  fullscreen.classList.add('hidden');
  document.body.classList.remove('modal-open');
});



// редактор фото

const editor = document.querySelector('.img-upload__overlay');
const editorClose = document.querySelector('.img-upload__cancel');
const editorForm = document.querySelector('.img-upload__form');

editorClose.addEventListener('click', (evt) => {
  evt.preventDefault();
  editor.classList.add('hidden');
  document.body.classList.remove('modal-open');
});

window.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    editor.classList.add('hidden');
    document.body.classList.remove('modal-open');
  }
})

//больше и меньше
const scaleSmaller = document.querySelector('.scale__control--smaller');
const scaleBigger = document.querySelector('.scale__control--bigger');
const scaleValue = document.querySelector('.scale__control--value');
const imagePreview = document.querySelector('.img-upload__preview > img');


let currentScale = 100;

const applyScale = () => {
  scaleValue.value = `${currentScale}%`;
  imagePreview.style.transform = `scale(${currentScale / 100})`;
};

applyScale();

scaleSmaller.addEventListener('click', (evt) => {
  evt.preventDefault();
  if (currentScale > 25) {
    currentScale -= 25;
    applyScale();
  }
});

scaleBigger.addEventListener('click', (evt) => {
  evt.preventDefault();
  if (currentScale < 100) {
    currentScale += 25;
    applyScale();
  }
});


//фильтры

const effectsList = document.querySelector('.effects__list');

effectsList.addEventListener('change', (evt) => {
  const effectId = evt.target.id;
  if (!effectId) return;

  const effectName = effectId.replace('effect-', '');

  imagePreview.className = '';

  if (effectName !== 'none') {
    imagePreview.classList.add(`effects__preview--${effectName}`);
  }
});




// хештеги

const hashtagInput = document.querySelector('.text__hashtags')

hashtagInput.addEventListener('input', () => {
  const errorMessage = validateHashtags(hashtagInput.value);
  if (errorMessage) {
    hashtagInput.setCustomValidity(errorMessage);
    hashtagInput.reportValidity();
  } else {
    hashtagInput.setCustomValidity('');
  }
});

function validateHashtags(value) {
  if (!value.trim()) return ''; // Хештеги необязательны

  const hashtags = value.trim().toLowerCase().split(/\s+/);

  if (hashtags.length > 5) {
    return 'Нельзя указать больше пяти хештегов';
  }

  const seen = new Set();

  for (const hashtag of hashtags) {
    if (hashtag[0] !== '#') {
      return 'Хештег должен начинаться с символа #';
    }

    if (hashtag === '#') {
      return 'Хештег не может состоять только из одной решётки';
    }

    if (hashtag.length > 20) {
      return 'Максимальная длина хештега — 20 символов';
    }

    const hashtagBody = hashtag.slice(1);

    if (!/^[a-zа-яё0-9]+$/i.test(hashtagBody)) {
      return 'Хештег должен содержать только буквы и цифры без спецсимволов, пробелов и эмодзи';
    }

    if (seen.has(hashtag)) {
      return 'Хештеги не должны повторяться';
    }

    seen.add(hashtag);
  }

  return '';
}


hashtagInput.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape') {
    evt.stopPropagation();
  }
});


//комментарий

const commentInput = document.querySelector('.text__description')

commentInput.addEventListener('input', () => {
  const errorMessage = validateComment(commentInput.value);
  if (errorMessage) {
    commentInput.setCustomValidity(errorMessage);
    commentInput.reportValidity();
  } else {
    commentInput.setCustomValidity('');
  }
});

function validateComment(value) {
  if (!value.trim()) return '';
}

commentInput.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape') {
    evt.stopPropagation();
  }
});


//форма

const form = document.querySelector('.img-upload__form')

form.addEventListener('submit', () => {

  hashtagInput.value = hashtagInput.value.trim();
  commentInput.value = commentInput.value.trim();

  if (!hashtagInput.value) {
    hashtagInput.value = '';
  }

  if (!commentInput.value) {
    commentInput.value = '';
  }
});


// загрузка своего фото

const uploadInput = document.querySelector('#upload-file');
const preview = document.querySelector('.img-upload__preview img');
const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

uploadInput.addEventListener('change', () => {
  const file = uploadInput.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some((it) => fileName.endsWith(it));

  if (!matches) {
    alert('Выберите файл с расширением gif, jpg, jpeg или png');
    uploadInput.value = '';
    return;
  }

  const blob = URL.createObjectURL(file);
  preview.src = blob;

  preview.onload = () => {
    URL.revokeObjectURL(blob);
  };

  editor.classList.remove('hidden');
  document.body.classList.add('modal-open');

  uploadInput.value = '';
});



// фильтры фотографий

const defaultFilterButton = document.querySelector('#filter-default');
const randomFilterButton = document.querySelector('#filter-random');
const discussedFilterButton = document.querySelector('#filter-discussed');

const clearPhotos = () => {
  const photos = document.querySelectorAll('.picture');
  photos.forEach((photo) => {
    photo.remove();
  });
}

const shuffleArray = (arr) => {
  let j, temp;
  for (let i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  return arr;
};


const onDefaultFilterClick = _.throttle(() => {
  clearPhotos();
  renderPhotos(allPhotos);

  defaultFilterButton.classList.add('img-filters__button--active');
  randomFilterButton.classList.remove('img-filters__button--active');
  discussedFilterButton.classList.remove('img-filters__button--active');
}, 500);

const onRandomFilterClick = _.throttle(() => {
  clearPhotos();
  renderPhotos(shuffleArray(allPhotos.slice()).slice(0, 10));

  randomFilterButton.classList.add('img-filters__button--active');
  defaultFilterButton.classList.remove('img-filters__button--active');
  discussedFilterButton.classList.remove('img-filters__button--active');
}, 500);

const onDiscussedFilterClick = _.throttle(() => {
  clearPhotos();
  renderPhotos(allPhotos.slice().sort((a, b) => b.comments.length - a.comments.length));

  discussedFilterButton.classList.add('img-filters__button--active');
  defaultFilterButton.classList.remove('img-filters__button--active');
  randomFilterButton.classList.remove('img-filters__button--active');
}, 500);


defaultFilterButton.addEventListener('click', onDefaultFilterClick);
randomFilterButton.addEventListener('click', onRandomFilterClick);
discussedFilterButton.addEventListener('click', onDiscussedFilterClick);



//показ 5 комментариев в полноэкранном режиме
