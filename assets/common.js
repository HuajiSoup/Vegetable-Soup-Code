import { hljs } from "./lib/highlight.js";
hljs.configure({ detectLanguageAutomatically: true });

function deepCopy(obj) {
    if (Array.isArray(obj)) {
        let copy = new Array(obj.length);
        for (let i = 0; i < obj.length; i++) {
            copy[i] = deepCopy(obj.at(i));
        }
        return copy;
    } else if (typeof obj == "object" && obj != null) {
        let copy = Object.create(obj);
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                copy[key] = deepCopy(obj[key]);
            }
        }
        return copy;
    }
    return obj;
}

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
export { deepCopy, $, $s, create };