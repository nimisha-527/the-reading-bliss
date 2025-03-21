const textContent = document.querySelectorAll(".text-truncate-content");
const readMoreBtn = document.getElementById("read-more-btn");

let isExpanded = false;
textContent.forEach((t) => {
    const dataBsWhatever = t.getAttribute("data-bs-whatever");
    function truncateText() {
        const words = t.textContent.split(" ");
        const truncatedWords = words.slice(0, 30);
        t.textContent = truncatedWords.join(" ") + "...";
    }
    
    if(readMoreBtn) {
        readMoreBtn.style.cursor = "pointer";

        function toggleText() {
            if (!isExpanded) {
            t.textContent = dataBsWhatever;
            readMoreBtn.textContent = "Read Less";
            } else {
            truncateText();
            readMoreBtn.textContent = "Read More";
            }
            isExpanded = !isExpanded;
        }
        readMoreBtn.addEventListener("click", toggleText);
    }
    
    // Initial truncation
    truncateText();
        
})