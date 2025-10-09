globalThis.pressing = false;

function addResizer(elem, horizonal = true, minkeep = 0) {
    // a resizer controls this elem and next elem
    let sibling;
    if (!(sibling = elem.nextElementSibling)) return;

    let resizer = document.createElement("div");
    resizer.classList.add("resizer");
    resizer.setAttribute("data-dragging", "0");

    let moveHandler;
    if (horizonal) {
        resizer.classList.add("hrz");
        moveHandler = (e) => {
            let total = elem.clientWidth + sibling.clientWidth;
            let widthElem, widthSibling;
            widthElem = Math.min(e.clientX - elem.offsetLeft, total);
            widthElem = (widthElem > minkeep/2) ? Math.max(widthElem, minkeep) : 0;
            widthSibling = total - widthElem;

            elem.style.width = widthElem + "px";
            sibling.style.width = widthSibling + "px";
        };
    } else {
        resizer.classList.add("vtc");
        moveHandler = (e) => {
            let total = elem.clientHeight + sibling.clientHeight;
            let heightElem, heightSibling;
            heightElem = Math.min(e.clientY - elem.offsetTop, total);
            heightElem = (heightElem > minkeep/2) ? Math.max(heightElem, minkeep) : 0;
            heightSibling = total - heightElem;

            elem.style.height = heightElem + "px";
            sibling.style.height = heightSibling + "px";
        };
    }

    let upHandler = () => {
        if (globalThis.pressing) {
            globalThis.pressing = false;
            document.removeEventListener("mousemove", moveHandler);
            document.removeEventListener("mouseup", upHandler);
        }
    };

    resizer.addEventListener("mousedown", () => {
        if (!globalThis.pressing) {
            globalThis.pressing = true;
            document.addEventListener("mousemove", moveHandler);
            document.addEventListener("mouseup", upHandler); // `once` > ES7
        }
    });

    elem.after(resizer);
}

function rebuildResizer(box, horizonal = true) {
    // this function clear all resizer in box between children
    box.querySelectorAll(":scope > .resizer").forEach(resizer => {
        resizer.remove();
    });
    // and absolut-ify child size
    let children = Array.from(box.children);
    console.log(children);
    let childrenSize;
    if (horizonal) {
        childrenSize = children.map(elem => elem.clientWidth);
        for (let i = 0; i < children.length; i++) {
            children[i].style.width = childrenSize[i] + "px";
            children[i].style.removeProperty("height");
        }
    } else {
        childrenSize = children.map(elem => elem.clientHeight);
        for (let i = 0; i < children.length; i++) {
            children[i].style.removeProperty("width");
            children[i].style.height = childrenSize[i] + "px";
        }
    }
    // and create new resizer
    children.forEach(elem => addResizer(elem, horizonal));
}

export {addResizer, rebuildResizer};