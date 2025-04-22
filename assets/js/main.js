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
const feedbackContainer = document.querySelector('.feedback');
let currentIndex = 0;
let intervalId;

function showItem(index) {
  feedbackList.style.transform = `translateX(-${index * 100}%)`;
  items.forEach(item => item.classList.remove('active'));
  items[index].classList.add('active');
}

function startAutoSlide() {
  intervalId = setInterval(() => {
    currentIndex = (currentIndex + 1) % items.length;
    showItem(currentIndex);
  }, 3000);
}

function stopAutoSlide() {
  clearInterval(intervalId);
}

feedbackContainer.addEventListener('mouseenter', stopAutoSlide);
feedbackContainer.addEventListener('mouseleave', startAutoSlide);

// Bắt đầu auto slide sau khi DOM sẵn sàng
startAutoSlide();

// Blog Chuyen Tiep
const dots = document.querySelectorAll('.dot');
const items1 = document.querySelectorAll('.blog .item');

// Ẩn tất cả các item blog và chỉ hiển thị nhóm 3 item tương ứng
function showBlogs(index) {
    items1.forEach((item, i) => {
        // Kiểm tra xem item có nằm trong nhóm 3 item cần hiển thị hay không
        if (i >= index * 3 && i < (index + 1) * 3) {
            item.style.display = 'block';  // Hiển thị item trong nhóm
        } else {
            item.style.display = 'none';  // Ẩn item ngoài nhóm
        }
    });
}

// Thêm sự kiện click vào các dot
dots.forEach(dot => {
    dot.addEventListener('click', function () {
        const index = parseInt(this.getAttribute('data-index'));

        // Hiển thị nhóm 3 blog dựa trên dot được click
        showBlogs(index);

        // Cập nhật active cho các dot
        dots.forEach(d => d.classList.remove('active'));
        this.classList.add('active');
    });
});

// Hiển thị nhóm blog đầu tiên khi trang load
showBlogs(0);



