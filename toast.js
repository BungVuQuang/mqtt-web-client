
var toast = document.querySelector(".toast");
var btn = document.querySelector(".toast-btn");
var close = document.querySelector(".toast-close");
var progress = document.querySelector(".progress-toast");
var text1 = document.querySelector('.text-1');
var text2 = document.querySelector('.text-2');

function toastActive() {
    toast.classList.add("active");
    progress.classList.add("active");

    setTimeout(() => {
        toast.classList.remove("active");
    }, 2000)

    setTimeout(() => {
        progress.classList.remove("active");
    }, 2300)
}

close.addEventListener("click", () => {
    toast.classList.remove("active");

    setTimeout(() => {
        progress.classList.remove("active");
    }, 300)
})