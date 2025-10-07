import { create } from "../../common.js";

function createFinder(textarea) {
    let textBox = textarea.closest(".textbox");

    let finder = create("div", "finder");
    let inputBox = create("div", "input-box");
    let input = create("input");
    let options = create("div", "options");
    let counter = create("p", "counter")
    let exit = create("span", "exit");

    finder.addEventListener("change", () => {
        CSS.highlights.clear();
        let str = input.value;
        if (!str) {
            let res = getHighlightRanges(textarea, str);
            let highlight = new Highlight(...res);
            CSS.highlights.set("search_result", highlight);
        }
    });

    exit.addEventListener("click", () => {
        finder.remove();
    }, { once : true });

    inputBox.appendChild(input);
    finder.appendChild(inputBox);
    options.appendChild(counter);
    options.appendChild(exit);
    finder.appendChild(options);

    return finder;
}


function getHighlightRanges(textarea, substr) {
    let textNode = textarea.firstChild;
    if (!textNode || textNode.nodeType != Node.TEXT_NODE) return [];

    let ranges = [];
    let indexs = findAllIndexs(textarea.value, substr);
    for (const index of indexs) {
        let range = new Range();
        range.setStart(textNode, index);
        range.setEnd(textNode, index + substr.length);
        ranges.push(range);
    }

    return ranges;
}

function findAllIndexs(str, sub) {
    let begin = 0;
    let indexs = [];
    let at;
    while ((at = str.indexOf(sub, begin) > 0)) {
        indexs.push(at);
        begin = at + sub.length;
    }
    return indexs;
}

export { createFinder };