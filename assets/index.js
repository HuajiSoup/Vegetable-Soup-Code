function initSectionIcon() {
    document.querySelectorAll("#sidebar .section").forEach(sec => {
        // css
        let icon = `./res/icon/${ sec.getAttribute("data-ico") }.svg`;
        let icoElem = document.createElement("div");
        icoElem.style["mask-image"] = icoElem.style["-webkit-mask-image"] = `url("${icon}")`;
        sec.appendChild(icoElem);

        // js
        sec.addEventListener("click", () => {
            // bieji, xianshiujiao
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initSectionIcon();
});