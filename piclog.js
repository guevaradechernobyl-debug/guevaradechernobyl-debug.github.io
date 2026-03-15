const imgElement = document.getElementById('piclogImage');
const piclogDiv = document.querySelector('.piclog');

const images = galleryImages;   // make sure this exists!
const staticImg = 'static.gif';

let currentIndex = 0;
let showingStatic = false;
let timeoutId = null;
let isRunning = false;

function cycle() {
  if (!isRunning) return;

  if (showingStatic) {
    imgElement.src = images[currentIndex];
    showingStatic = false;
    timeoutId = setTimeout(cycle, 2000);

  } else {
    imgElement.src = staticImg;
    showingStatic = true;

    timeoutId = setTimeout(() => {
      let nextIndex;

      // Prevent infinite loop if only 1 image
      if (images.length <= 1) {
        nextIndex = 0;
      } else {
        do {
          nextIndex = Math.floor(Math.random() * images.length);
        } while (nextIndex === currentIndex);
      }

      currentIndex = nextIndex;
      cycle();
    }, 500);
  }
}

function startCycle() {
  if (isRunning) return;
  isRunning = true;
  cycle();
}

function stopCycle() {
  isRunning = false;
  clearTimeout(timeoutId);
  timeoutId = null;
}

window.addEventListener('DOMContentLoaded', () => {
  if (!images || images.length === 0) {
    console.error("galleryImages is empty or undefined");
    return;
  }

  imgElement.src = images[currentIndex];
  startCycle();
});