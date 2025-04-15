const courseList = document.querySelector(".course-list");
const nextBtn = document.querySelector(".next-btn");
const prevBtn = document.querySelector(".prev-btn");

const itemWidth = document.querySelector(".course-item").offsetWidth + 30; // 30 là gap
const itemsPerSlide = 3;
let currentIndex1 = 0;

nextBtn.addEventListener("click", () => {
    const totalItems = document.querySelectorAll(".course-item").length;
    const maxIndex = Math.ceil(totalItems / itemsPerSlide) - 1;
    if (currentIndex1 < maxIndex) {
        currentIndex1++;
        courseList.style.transform = `translateX(-${currentIndex1 * itemWidth * itemsPerSlide}px)`;
    }
});

prevBtn.addEventListener("click", () => {
    if (currentIndex1 > 0) {
        currentIndex1--;
        courseList.style.transform = `translateX(-${currentIndex1 * itemWidth * itemsPerSlide}px)`;
    }
});


