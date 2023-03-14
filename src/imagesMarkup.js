export function imagesMarkup (img) {
    return img.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => `
    <div class="photo-card">
    <a class="photo-card-item" href="${largeImageURL}"> <img src="${webformatURL}" data-source= "${largeImageURL}" alt="${tags}" loading="lazy" /> </a>
    <div class="info">
    <p class="info-item">
        <b>Likes:</b> ${likes}
    </p>
    <p class="info-item">
        <b>Views:</b> ${views}
    </p>
    <p class="info-item">
        <b>Comments:</b> ${comments}
    </p>
    <p class="info-item">
        <b>Downloads:</b> ${downloads}
    </p>
    </div>
  </div>
    `).join('');
    }