window.addEventListener("orientationchange", () => { location.reload(); })

window.addEventListener("resize", () => {
    if (window.innerWidth > 992) return;

    changeSliderWidth();
});

// Шапка
const header = document.querySelector("header");
const burger = document.querySelector(".burger-toggle");
const main = document.querySelector("main");
const footer = document.querySelector("footer");

burger.addEventListener("click", () => {
    const navHeight = document.querySelector("nav").offsetHeight;
    let headerHeight;

    burger.classList.toggle("active");

    if (burger.classList.contains("active")) {
        headerHeight = 80 + navHeight;
    } else {
        headerHeight = 70;
    }

    header.style.height = headerHeight + "px";
    main.style.minHeight = `${window.innerHeight - (headerHeight + 30 + footer.offsetHeight)}px`;
})

// Slider

const slider = document.querySelector(".slider");
const sizeToggleBtn = document.querySelector(".size-toggle")
const toLeftBtn = document.querySelector(".to-left");
const toRightBtn = document.querySelector(".to-right");

let slides = new Array();
let indexOfActive = 0;
let minimized = false;

function changeSliderWidth() {
    const sliderContainer = document.querySelector(".slider-container");
    const width = sliderContainer.offsetWidth;

    slides.forEach((slide) => {
        slide.style.height = `${340 * width / 1280}px`;
        slide.style.width = `${width}px`;
    })
}

let startTimer = setInterval(() => {
    if (indexOfActive == slides.length - 1) {
        while (indexOfActive > 0) {
            toLeftBtn.click();
        }
    } else
        toRightBtn.click();
}, 5000);

const statusBar = document.createElement("div");
statusBar.classList.add("slider-status-bar");
toRightBtn.after(statusBar);

for (let i = 0; i < 5; i++) {
    const div = document.createElement("div");
    const bar = document.createElement("div");

    div.classList.add("slide");
    div.classList.add((i > 2) ? "slide-n" : `slide-${i + 1}`);
    if (i == indexOfActive) {
        div.classList.add("active");
        bar.classList.add("active-bar");
    }

    if (i == 0) toRightBtn.before(div);

    const a = document.createElement("a");
    a.classList.add("slide-info");
    a.setAttribute("href", "");
    a.innerText = "Подробнее";
    div.append(a);

    slides.push(div);
    statusBar.append(bar);
}

const bars = [...statusBar.children];

changeSliderWidth();
statusBar.style.left = `${(slider.offsetWidth - statusBar.offsetWidth) / 2}px`;

let shown = [...document.querySelectorAll(".slide")];

sizeToggleBtn.addEventListener("click", () => {
    const span = sizeToggleBtn.childNodes[1];

    if (minimized) {
        if (indexOfActive == 0) {
            shown.pop().remove();
            shown.pop().remove();
        } else if (indexOfActive == slides.length - 1) {
            shown.shift().remove();
            shown.shift().remove();
        } else {
            shown.pop().remove();
            shown.shift().remove();
        }

        span.innerText = "close_fullscreen";
    } else {
        if (indexOfActive == 0) {
            shown.push(slides[indexOfActive + 1]);
            toRightBtn.before(slides[indexOfActive + 1]);
            shown.push(slides[indexOfActive + 2]);
            toRightBtn.before(slides[indexOfActive + 2]);
        } else if (indexOfActive == slides.length - 1) {
            shown.unshift(slides[indexOfActive - 1]);
            sizeToggleBtn.after(slides[indexOfActive - 1]);
            shown.unshift(slides[indexOfActive - 2]);
            sizeToggleBtn.after(slides[indexOfActive - 2]);
        } else {
            shown.push(slides[indexOfActive + 1]);
            toRightBtn.before(slides[indexOfActive + 1]);
            shown.unshift(slides[indexOfActive - 1]);
            sizeToggleBtn.after(slides[indexOfActive - 1]);
        }

        span.innerText = "open_in_full";
    }

    minimized = !minimized;
    slider.classList.toggle("minimized");
})

toLeftBtn.addEventListener("click", () => {
    if (indexOfActive == 0) return;

    bars[indexOfActive].classList.remove("active-bar");

    slides[indexOfActive--].classList.remove("active");
    slides[indexOfActive].classList.add("active");

    bars[indexOfActive].classList.add("active-bar");

    if (minimized && (indexOfActive == 0 || indexOfActive == slides.length - 2)) return;

    shown.unshift(slides[indexOfActive - minimized]);
    sizeToggleBtn.after(slides[indexOfActive - minimized]);

    slides[indexOfActive].scrollIntoView({behavior: "smooth"});

    shown.pop().remove();
})

toRightBtn.addEventListener("click", () => {
    if (indexOfActive == slides.length - 1) return;

    bars[indexOfActive].classList.remove("active-bar");

    slides[indexOfActive++].classList.remove("active");
    slides[indexOfActive].classList.add("active");

    bars[indexOfActive].classList.add("active-bar");

    if (minimized && (indexOfActive == 1 || indexOfActive == slides.length - 1)) return;

    shown.push(slides[indexOfActive + minimized]);
    toRightBtn.before(slides[indexOfActive + minimized]);

    slides[indexOfActive].scrollIntoView({behavior: "smooth"});

    shown.shift().remove();
})

slider.addEventListener("mouseout", () => {
    startTimer = setInterval(() => {
        if (indexOfActive == slides.length - 1) {
            while (indexOfActive > 0) {
                toLeftBtn.click();
            }
        } else 
            toRightBtn.click();
    }, 5000);
})

slider.addEventListener("mouseover", () => {
    clearInterval(startTimer);
})