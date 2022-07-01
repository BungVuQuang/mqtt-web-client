const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const clodeBtn = document.querySelector("#close-btn");
const themeToggler = document.querySelector(".theme-toggler")

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const tabs = $$(".tab-item");
const panes = $$(".tab-pane");

const tabActive = $(".tab-item.active");
const line = $(".tabs .line");

var toast = document.querySelector(".toast");
var btn = document.querySelector(".toast-btn");
var close = document.querySelector(".toast-close");
var progress = document.querySelector(".progress-toast");

toast.classList.add("active");
progress.classList.add("active");

setTimeout(() => {
    toast.classList.remove("active");
}, 2000)

setTimeout(() => {
    progress.classList.remove("active");
}, 2300)

close.addEventListener("click", () => {
    toast.classList.remove("active");

    setTimeout(() => {
        progress.classList.remove("active");
    }, 300)
})

menuBtn.addEventListener('click', () => {
    sideMenu.style.display = 'block';

});

clodeBtn.addEventListener('click', () => {
    sideMenu.style.display = 'none';
});

themeToggler.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme-variables');

    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');
});

tabs.forEach((tab, index) => {
    const pane = panes[index];

    tab.onclick = function () {
        $(".tab-item.active").classList.remove("active");
        $(".tab-pane.active").classList.remove("active");


        this.classList.add("active");
        pane.classList.add("active");
    };
});
