import { checkEsc } from './util.js';

const COMMENTS_LOAD_STEP = 5;

const bigPicture = document.querySelector('.big-picture');
const scrollOff = document.querySelector('body');
const bigPictureClose = document.querySelector('.big-picture__cancel');
const commentTemplate = document.querySelector('#comment').content.querySelector('.social__comment');
const commentList = document.querySelector('.social__comments')

let commentsLoaded = [];

const commentCount = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');

let commentsCount = COMMENTS_LOAD_STEP;

const onBigPictureCloseClick = () => {
  bigPicture.classList.add('hidden');
  scrollOff.classList.remove('modal-open');
  bigPictureClose.removeEventListener('click', onBigPictureCloseClick);
  commentList.innerHTML = '';
  document.removeEventListener('keydown', onBigPictureEscKeyDown)
  commentsCount = COMMENTS_LOAD_STEP;
  commentsLoaded = [];
};

// функция вывода комментариев

const renderComment = (comment) => {
  const commentSimilar = commentTemplate.cloneNode(true);

  commentSimilar.querySelector('.social__picture').src = comment.avatar;
  commentSimilar.querySelector('.social__picture').alt = comment.name;
  commentSimilar.querySelector('.social__text').textContent = comment.message;

  return commentSimilar;
};

const renderComments = (comments) => {

  const onCommentsLoaderClick = () => {
    renderComments(comments);
  }

  commentsCount = (comments.length < COMMENTS_LOAD_STEP) ? comments.length : commentsCount;
  commentsLoaded = comments.slice(0, commentsCount);

  commentList.innerHTML = '';

  commentCount.textContent = `${commentsLoaded.length} из ${comments.length} комментариев`;

  let commentsListFragment = document.createDocumentFragment();

  commentsLoaded.forEach(comment => {
    commentsListFragment.appendChild(renderComment(comment));
  });

  commentList.appendChild(commentsListFragment);

  if (comments.length > COMMENTS_LOAD_STEP && commentsLoaded.length < comments.length) {
    commentsLoader.classList.remove('hidden');
    commentsLoader.addEventListener('click', onCommentsLoaderClick, { once: true })
  } else {
    commentsLoader.classList.add('hidden');
  }

  commentsCount += COMMENTS_LOAD_STEP;
}

const onBigPictureEscKeyDown = (evt) => {
  if (checkEsc(evt)) {
    onBigPictureCloseClick()
  }
}

// функция вывода большой картинки/поста
const show = (picture) => {
  commentsCount = COMMENTS_LOAD_STEP;
  commentsLoaded = [];
  scrollOff.classList.add('modal-open');
  bigPicture.querySelector('.big-picture__img > img').src = picture.url;
  bigPicture.querySelector('.likes-count').textContent = picture.likes;
  bigPicture.querySelector('.social__caption').textContent = picture.description;

  bigPictureClose.addEventListener('click', onBigPictureCloseClick);
  bigPicture.classList.remove('hidden');

  document.addEventListener('keydown', onBigPictureEscKeyDown)

  renderComments(picture.comments.slice())
};

export { show };
