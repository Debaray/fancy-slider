const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBox = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');
const sliderDurationBox = document.getElementById('duration');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const selectedImageTag = document.getElementById('selected-image');
const selectedImageCount = document.getElementById('selected-image-count');
const noDataDiv = document.getElementById('no-data-found');
const createSlideDuration = document.getElementById('create-slide-duration');
const containerMain = document.getElementById('container-main');

// selected image 
let sliders = [];
selectedImageTag.style.display = 'none';

// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

//Enter Press
searchBox.addEventListener('keypress', function (event) {
  if (event.key == 'Enter') {
    searchBtn.click();
  }
})

sliderDurationBox.addEventListener('keypress', function (event) {
  if (event.key == 'Enter') {
    sliderBtn.click();
  }
})

const displayControl = (element, display) => {
  element.style.display = `${display}`;
}

// show images 
const showImages = (images) => {
  if (images.length === 0) {
    isDisplayMealEmpty();
    return;
  }
  

  gallery.innerHTML = '';
  // show gallery title
  displayControl(galleryHeader, 'flex');
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div)
    displayControl(selectedImageTag, 'block');

    selectedImageCount.innerText = sliders.length;
    displayControl(imagesArea, 'block');
  displayControl(noDataDiv, 'none');
  displayControl(createSlideDuration, 'flex');
  displayControl(gallery, 'flex');
  displayControl(containerMain,'none');
  })

}

const getImages = (query) => {
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => showImages(data.hits))
    .catch(err => isDisplayMealEmpty())
}

let slideIndex = 0;
const selectItem = (event, img) => {

  let element = event.target;
  element.classList.add('added');

  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
    selectedImageCount.innerText = sliders.length;
  } else {
    sliders.splice(item, 1);
    element.classList.remove('added');
    selectedImageCount.innerText = sliders.length;
  }
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  const duration = document.getElementById('duration').value || 1000;
  const isDurationInteger = parseFloat(duration);
  if (!Number.isInteger(isDurationInteger) == true || isDurationInteger <= 0) {
    alert('Duration should be positive integer number!!!!');
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  displayControl(containerMain,'block');
  // hide image area
  displayControl(imagesArea, 'none');
  displayControl(selectedImageTag, 'none');
  displayControl(noDataDiv, 'none');

  selectedImageCount.innerText = "0";

  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, isDurationInteger);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

const isDisplayMealEmpty = () => {

  
  const createNoDataDiv = document.createElement('div');
  noDataDiv.innerHTML = "";
  const noDataInfo = `
      <div class="mt-5 mb-5 d-flex justify-content-center">
      <img src="images/noDataFound.webp">
      </div>
     `;
  createNoDataDiv.innerHTML = noDataInfo;
  noDataDiv.appendChild(createNoDataDiv);
  displayControl(noDataDiv, 'block');
  displayControl(gallery, 'none');
  displayControl(createSlideDuration, 'none');
  displayControl(selectedImageTag, 'none');
  selectedImageCount.innerText = "0";
}
searchBtn.addEventListener('click', function () {
  displayControl(containerMain,'none');
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)
  sliders.length = 0;
})

sliderBtn.addEventListener('click', function () {
  createSlider()
})
