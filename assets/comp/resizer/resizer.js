window.pressing = false;

function addResizer(elem, horizonal = true, minkeep = 0) {
    let resizer = document.createElement("div");
    resizer.classList.add("resizer");
    resizer.setAttribute("data-dragging", "0");

    let moveHandler;
    if (horizonal) {
        resizer.classList.add("hrz");
        moveHandler = (e) => {
            let _width = e.clientX - elem.offsetLeft;
            elem.style.width = (_width > minkeep/2) ? Math.max(minkeep, _width) + "px" : 0;
        };
    } else {
        resizer.classList.add("vtc");
        moveHandler = (e) => {
            let _height = e.clientY - elem.offsetTop;
            elem.style.height = (_height > minkeep/2) ? Math.max(minkeep, _height) + "px" : 0;
        };
    }

    let upHandler = () => {
        if (window.pressing) {
            window.pressing = false;
            document.removeEventListener("mousemove", moveHandler);
            document.removeEventListener("mouseup", upHandler);
        }
    };

    resizer.addEventListener("mousedown", () => {
        if (!window.pressing) {
            window.pressing = true;
            document.addEventListener("mousemove", moveHandler);
            document.addEventListener("mouseup", upHandler); // `once` > ES7
        }
    });

    elem.after(resizer);
}

export {addResizer};