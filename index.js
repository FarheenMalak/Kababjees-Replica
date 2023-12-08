window.addEventListener("scroll", function() {
    var navbar = document.querySelector(".navbar");
    var navbarBrand = document.querySelector(".navbar-brand");
    var navbarImage = document.querySelector(".navbar-image");
    if (window.pageYOffset > 100) {
      navbar.classList.add("scrolled");
      
    } else {
      navbar.classList.remove("scrolled");
        }
  });  
  // // slider
      let currentIndex = 0;
      let slider = document.querySelector('.card-slider');
      let cards = document.querySelectorAll('.card');
      let cardWidth = cards[0].clientWidth;
      let timer;
  
      function moveSlider(direction) {
        clearInterval(timer);
        timer = setInterval(function () {
          moveSlider(direction);
        }, 3000);
  
        if (direction === 'left') {
          currentIndex -= 1;
        } else {
          currentIndex += 1;
        }
        
        currentIndex = (currentIndex + cards.length) % cards.length;
        
        slider.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
      }
  
      document.querySelector('.card-slider').addEventListener('mouseover', function () {
        clearInterval(timer);
      });
  
      document.querySelector('.card-slider').addEventListener('mouseout', function () {
        timer = setInterval(function () {
          moveSlider('right');
        }, 3000);
      });
  
      timer = setInterval(function () {
        moveSlider('right');
      }, 3000);
      document.querySelector('.left-button').addEventListener('click', () => moveSlider('left'));
      document.querySelector('.right-button').addEventListener('click', () => moveSlider('right'));

//  /image slider
const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const firstCardWidth = carousel.querySelector(".imgcard").offsetWidth;
const arrowBtns = document.querySelectorAll(".wrapper i");
const carouselChildrens = [...carousel.children];

let isDragging = false, isAutoPlay = true, startX, startScrollLeft, timeoutId;

// Get the number of cards that can fit in the carousel at once
let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

// Insert copies of the last few cards to beginning of carousel for infinite scrolling
carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});

// Insert copies of the first few cards to end of carousel for infinite scrolling
carouselChildrens.slice(0, cardPerView).forEach(card => {
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Scroll the carousel at appropriate postition to hide first few duplicate cards on Firefox
carousel.classList.add("no-transition");
carousel.scrollLeft = carousel.offsetWidth;
carousel.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the carousel left and right
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        carousel.scrollLeft += btn.id == "left" ? -firstCardWidth : firstCardWidth;
    });
});

const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");
    // Records the initial cursor and scroll position of the carousel
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
}

const dragging = (e) => {
    if(!isDragging) return; // if isDragging is false return from here
    // Updates the scroll position of the carousel based on the cursor movement
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
}

const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
}

const infiniteScroll = () => {
    // If the carousel is at the beginning, scroll to the end
    if(carousel.scrollLeft === 0) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
        carousel.classList.remove("no-transition");
    }
    // If the carousel is at the end, scroll to the beginning
    else if(Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove("no-transition");
    }

    // Clear existing timeout & start autoplay if mouse is not hovering over carousel
    clearTimeout(timeoutId);
    if(!wrapper.matches(":hover")) autoPlay();
}

const autoPlay = () => {
    if(window.innerWidth < 800 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
    // Autoplay the carousel after every 2500 ms
    timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500);
}
autoPlay();

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);

// gallery slider

const gallerycarousel = document.querySelector(".gallerycarousel"),
firstImg = gallerycarousel.querySelectorAll("img")[0],
arrowIcons = document.querySelectorAll(".gallerywrapper i");

let IsDragStart = false, IsDragging = false, prevPageX, prevScrollLeft, positionDiff;

const showHideIcons = () => {
    // showing and hiding prev/next icon according to carousel scroll left value
    let scrollWidth = gallerycarousel.scrollWidth - gallerycarousel.clientWidth; // getting max scrollable width
    arrowIcons[0].style.display = gallerycarousel.scrollLeft == 0 ? "block" : "block";
    arrowIcons[1].style.display = gallerycarousel.scrollLeft == scrollWidth ? "block" : "block";
}

arrowIcons.forEach(icon => {
    icon.addEventListener("click", () => {
        let firstImgWidth = firstImg.clientWidth + 14; // getting first img width & adding 14 margin value
        // if clicked icon is left, reduce width value from the carousel scroll left else add to it
        gallerycarousel.scrollLeft += icon.id == "left" ? -firstImgWidth : firstImgWidth;
        setTimeout(() => showHideIcons(), 60); // calling showHideIcons after 60ms
    });
});

const autoSlide = () => {
    // if there is no image left to scroll then return from here
    if(gallerycarousel.scrollLeft - (gallerycarousel.scrollWidth - gallerycarousel.clientWidth) > -1 || gallerycarousel.scrollLeft <= 0) return;

    positionDiff = Math.abs(positionDiff); // making positionDiff value to positive
    let firstImgWidth = firstImg.clientWidth + 14;
    // getting difference value that needs to add or reduce from carousel left to take middle img center
    let valDifference = firstImgWidth - positionDiff;

    if(gallerycarousel.scrollLeft > prevScrollLeft) { // if user is scrolling to the right
        return gallerycarousel.scrollLeft += positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff;
    }
    // if user is scrolling to the left
    gallerycarousel.scrollLeft -= positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff;
}

const DragStart = (e) => {
    // updatating global variables value on mouse down event
    IsDragStart = true;
    prevPageX = e.pageX || e.touches[0].pageX;
    prevScrollLeft = gallerycarousel.scrollLeft;
}

const Dragging = (e) => {
    // scrolling images/carousel to left according to mouse pointer
    if(!IsDragStart) return;
    e.preventDefault();
    IsDragging = true;
    gallerycarousel.classList.add("dragging");
    positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;
    gallerycarousel.scrollLeft = prevScrollLeft - positionDiff;
    showHideIcons();
}

const DragStop = () => {
    IsDragStart = false;
    gallerycarousel.classList.remove("dragging");

    if(!IsDragging) return;
    IsDragging = false;
    autoSlide();
}

gallerycarousel.addEventListener("mousedown", DragStart);
gallerycarousel.addEventListener("touchstart", DragStart);

document.addEventListener("mousemove", Dragging);
carousel.addEventListener("touchmove", Dragging);

document.addEventListener("mouseup", DragStop);
carousel.addEventListener("touchend", DragStop);

//PARAGRAPH-SLIDER
        let slideIndex = 0;
        const dots = document.querySelectorAll('.dot');
        const reviewslides = document.querySelectorAll('.reviewslide');

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                slideIndex = i;
                showSlides();
            });
        });

        function showSlides() {
            reviewslides.forEach(reviewslide => {
                reviewslide.style.opacity = 0;
            });

            reviewslides[slideIndex].style.opacity = 1;

            dots.forEach(dot => {
                dot.style.backgroundColor = 'transparent';
            });

            dots[slideIndex].style.backgroundColor = '#dcb658';
        }

        let interval = setInterval(function () {
            slideIndex++;
            if (slideIndex > reviewslides.length - 1) {
                slideIndex = 0;
            }
            showSlides();
        }, 3000);
