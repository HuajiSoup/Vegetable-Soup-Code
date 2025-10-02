window.pressing = false;
window.pressingFunction = null;

document.addEventListener("mouseup", () => {
    if (window.pressing) {
        window.pressing = false;
        document.removeEventListener("mousemove", window.pressingFunction);
        window.pressingFunction = null;
    }
})

function addResizer(elem, horizonal = true, minkeep = 0) {
    let resizer = document.createElement("div");
    resizer.classList.add("resizer");
    resizer.setAttribute("data-dragging", "0");

    let moveHandler;
    if (horizonal) {
        resizer.classList.add("hrz");
        moveHandler = (e) => {
            elem.style.width = e.clientX - elem.offsetLeft + "px";
        };
    } else {
        resizer.classList.add("vtc");
        moveHandler = (e) => {
            elem.style.height = e.clientY - elem.offsetTop + "px";
        };
    }

    resizer.addEventListener("mousedown", () => {
        if (!window.pressing) {
            window.pressing = true;
            window.pressingFunction = moveHandler;
            document.addEventListener("mousemove", moveHandler);
        }
    });

    elem.after(resizer);
}

export {addResizer};