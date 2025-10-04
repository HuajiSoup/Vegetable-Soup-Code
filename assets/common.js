function $(selector) {
    return document.querySelector(selector);
}

function $s(selector) {
    return document.querySelectorAll(selector);
}

function create(tagname, classname, id) {
    let elem = document.createElement(tagname);
    if (classname) elem.className = classname;
    if (id) elem.id = id;

    return elem;
}

export { $, $s, create };