function fadeOnload() {
    const elements = document.querySelectorAll(".fade-in-load");
    elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
            el.classList.add("visible");
        }
    });
}

fadeOnload(); // Run once on page load

function fadeOnScroll() {
    const elements = document.querySelectorAll(".fade-in-scroll-js");
    elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
            el.classList.add("visible");
            el.classList.remove("hidden");
        } else {
            el.classList.remove("visible");
            el.classList.add("hidden");
        }
    });
}

window.addEventListener("scroll", fadeOnScroll);
fadeOnScroll()

// This is needed if the user scrolls down during page load and you want to make sure the page is scrolled to the top once it's fully loaded. This has Cross-browser support.
window.scrollTo(0,0);