import { Notify } from "notiflix";
import {searchImages} from './searchImages';
import { imagesMarkup } from "./imagesMarkup";
import * as basicLightbox from 'basiclightbox'
import "basiclightbox/dist/basicLightbox.min.css"


const refs = {
    form: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    loadMore: document.querySelector('.load-more'),
    gallery: document.querySelector('.gallery')
}

let PAGE_VALUE = 1;
let searchTerm = '';
let count = null;

refs.form.addEventListener ('submit', onFormSubmit);
refs.loadMore.addEventListener ('click', onLoadMoreClick);
refs.gallery.addEventListener('click', onGalleryImgClick);

function onFormSubmit (e) {
    e.preventDefault();
    clearForm();
    isBtnHidden(true);
    count = null;
    PAGE_VALUE = 1;
    
    searchTerm = e.target.searchQuery.value.trim();

    getResult(searchTerm, PAGE_VALUE)
    .then(res => 
    {Notify.success(`Hooray! We found ${res.data.totalHits} images.`);
    createMarkup(res.data.hits);
    onScroll(0.2)})
    .catch(err => console.log(err));
};

function onLoadMoreClick () {
    loadMoreDisable();
    
    getResult(searchTerm, PAGE_VALUE).then(res => {if (count >= res.data.totalHits) {isBtnHidden(true);
    Notify.info("We're sorry, but you've reached the end of search results.")};
    createMarkup(res.data.hits)
    onScroll(2)})
    .catch(err => console.log(err))

    loadMoreEnable()
}

function onGalleryImgClick (e) {
    e.preventDefault();

    if (e.target.nodeName !== "IMG") {
        return
    }

    const instance = basicLightbox.create(`<img src="${e.target.dataset.source}" width="800" height="600">`, 
    {onShow: (instance) => {window.addEventListener('keydown', onKeyPress)}, 
    onClose: (instance) => {window.removeEventListener('keydown', onKeyPress)}}
    );

    instance.show();

    function onKeyPress (e) {
        if (e.key === 'Escape') {
            instance.close();
        }
    }
}

function onScroll (value) {
    const { height: cardHeight } = refs.gallery
   .firstElementChild.getBoundingClientRect();
 
 window.scrollBy({
   top: cardHeight * value,
   behavior: "smooth",
 }); 
}


const getResult = async (searchTerm, PAGE_VALUE) => {
    try {
        const res = await searchImages(searchTerm, PAGE_VALUE);
        refreshCounters(res.data.hits.length);
        if (res.data.hits.length === 0 || searchTerm === '') 
        {Notify.failure("Sorry, there are no images matching your search query. Please try again."); 
        return}
        else if (count >= res.data.totalHits) {isBtnHidden(true);
        return res
        }
        isBtnHidden(false);
        return res
    } catch (err) {console.log(err.message)}
}

function isBtnHidden (value) {
    refs.loadMore.classList.toggle('is-hidden', value)
}

function loadMoreEnable () {
    refs.loadMore.disabled = false;
    refs.loadMore.textContent = 'Load more';
  }

  function loadMoreDisable () {
    refs.loadMore.disabled = true;
    refs.loadMore.textContent = 'Loading...';
  }

function createMarkup (data) {
    refs.gallery.insertAdjacentHTML("beforeend", imagesMarkup(data))
}

function clearForm () {
    refs.gallery.innerHTML = ''
}

function refreshCounters (value) {
    count += value;
    PAGE_VALUE += 1;
}


