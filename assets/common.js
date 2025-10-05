import { hljs } from "./lib/highlight.js";
hljs.configure({ detectLanguageAutomatically: true });

function $(selector) {
    return document.querySelector(selector);
}

function $s(selector) {
    return document.querySelectorAll(selector);
}

function create(tagname, classname, id, attr = {}) {
    let elem = document.createElement(tagname);
    if (classname) elem.className = classname;
    if (id) elem.id = id;
    for (const key in attr) {
        if (!Object.hasOwn(attr, key)) continue;
        elem.setAttribute(key, attr[key]);
    }

    return elem;
}

export { hljs };
export { $, $s, create };