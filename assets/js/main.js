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
// Feedback slider
const feedbackList = document.getElementById('feedbackList');
    const items = document.querySelectorAll('.feedback-item');
    let currentIndex = 0;

    function showItem(index) {
      // Cập nhật vị trí của feedbackList
      feedbackList.style.transform = `translateX(-${index * 100}%)`;

      // Xóa class active của tất cả các item
      items.forEach(item => item.classList.remove('active'));

      // Thêm class active vào item hiện tại
      items[index].classList.add('active');
    }

    setInterval(() => {
      currentIndex = (currentIndex + 1) % items.length;
      showItem(currentIndex);
    }, 3000); // Chuyển đổi sau mỗi 4 giây

