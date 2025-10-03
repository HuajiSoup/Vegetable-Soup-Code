function initPanelCards() {
    document.querySelectorAll("#func .card-box .card-toggle").forEach(toggle => {
        let box = toggle.parentElement;
        toggle.addEventListener("click", () => {
            box.setAttribute("data-open", box.getAttribute("data-open") == "1" ? 0 : 1);
        });
    });
}

export { initPanelCards };