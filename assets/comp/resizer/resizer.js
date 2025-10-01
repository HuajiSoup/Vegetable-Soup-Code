function addResizer(elem, horizonal = true, minkeep = 0) {
    let resizer = document.createElement("div");
    resizer.classList.add("resizer");
    resizer.setAttribute("data-dragging", "0");

    let _moveHandler;
    if (horizonal) {
        resizer.classList.add("hrz");
        _moveHandler = (e) => {
            elem.style.width = e.clientX - elem.offsetLeft + "px";
        };
    } else {
        resizer.classList.add("vtc");
        _moveHandler = (e) => {
            elem.style.height = e.clientY - elem.offsetTop + "px";
        };
    }
    let moveHandler = (e) => { _moveHandler(e); }

    resizer.addEventListener("mousedown", () => {
        document.addEventListener("mousemove", moveHandler);
    });
    resizer.addEventListener("mouseup", () => {
        document.removeEventListener("mousemove", moveHandler);
    });

    elem.after(resizer);
}

export {addResizer};