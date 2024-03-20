const sliderContent = document.querySelector('.slider-content');
const sliderItems = document.querySelectorAll('.slider-item');
const sliderWidth = sliderItems[0].offsetWidth;
let currentIndex = 0;

function nextSlide() {
    if (currentIndex < sliderItems.length - 1) {
        currentIndex++;
    } else {
        currentIndex = 0;
    }
    updateSlider();
}

function updateSlider() {
    const newPosition = -currentIndex * sliderWidth;
    sliderContent.style.transform = `translateX(${newPosition}px)`;
}

setInterval(nextSlide, 3000); // Cambiar la imagen cada 3 segundos
