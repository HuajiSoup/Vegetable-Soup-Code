import { create } from "../../common.js";

function createContextMenu(options = {}) {
    let menu = create("div", "contextmenu");
    for (const name in options) {
        if (Object.hasOwn(options, name)) {
            let item = create("div", "item");
            item.textContent = name;
            item.onclick = options[name];
            menu.appendChild(item);
        };
    }

    menu.style.display = "none";
    return menu;
}

function showContextMenu(menu, x, y) {
    let menuWidth  = menu.clientWidth;
    let menuHeight = menu.clientHeight;
    let docWidth   = document.clientWidth;
    let docHeight  = document.clientHeight;
    if (docWidth - x < menuWidth) {
        x -= menuWidth;
    }
    if (docHeight - y < menuHeight) {
        y -= menuHeight;
    }

    menu.style.left = x + "px";
    menu.style.top  = y + "px";
    menu.style.display = "flex";
}

function closeContextMenu(menu) {
    menu.style.display = "none";
}

export { createContextMenu, showContextMenu, closeContextMenu };