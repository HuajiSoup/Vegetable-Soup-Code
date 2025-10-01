import { addResizer } from "../comp/resizer/resizer.js";

function initSectionIcon() {
    document.querySelectorAll("#sidebar .section").forEach(sec => {
        // css
        let icon = `./res/icon/${ sec.getAttribute("data-ico") }.svg`;
        let icoElem = document.createElement("div");
        icoElem.style["mask-image"] = icoElem.style["-webkit-mask-image"] = `url("${icon}")`;
        sec.appendChild(icoElem);
    });

    document.querySelector("#sidebar .up-box").addEventListener("click", (e) => {
        let selected = e.target.closest(".section").id;
        document.querySelectorAll(".up-box .section").forEach(sec => {
            sec.setAttribute("data-focus", sec.id == selected ? 1 : 0);
        });
        document.querySelectorAll("#func .panel").forEach(panel => {
            panel.style["display"] = (
                panel.id == "panel-" + selected ? "flex" : "none"
            );
        });
    });
}

function initResizer() {
    addResizer(document.querySelector("#func"));
}

document.addEventListener("DOMContentLoaded", () => {
    initSectionIcon();
    initResizer();
});