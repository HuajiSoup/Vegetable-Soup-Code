import { create } from "../../common.js";

function createFinder(textbox) {
    let textarea = textbox.querySelector("textarea");
    let codearea = textbox.querySelector("pre code");

    let finder = create("div", "finder");
    let inputBox = create("div", "input-box");
    let input = create("input");
    let options = create("div", "options");
    let counter = create("p", "counter")
    let exit = create("div", "exit");

    finder.addEventListener("change", () => {
        CSS.highlights.clear();
        let str = input.value;
        if (!str) return;

        let res = getHighlightRanges(codearea, str);
        let highlight = new Highlight(...res);
        CSS.highlights.set("search", highlight);
        counter.innerHTML = `共找到 ${res.length} 项`
    });

    exit.addEventListener("click", () => {
        CSS.highlights.clear();
        finder.remove();
    }, { once : true });

    inputBox.appendChild(input);
    finder.appendChild(inputBox);
    options.appendChild(counter);
    options.appendChild(exit);
    finder.appendChild(options);

    return finder;
}


function getHighlightRanges(codearea, substr) {
    let textNodes = getAllTextNodes(codearea).filter(node => node.textContent);
    let textLength = textNodes.reduce((list, cur, i) => {
        list[i] += (list[i-1] ?? 0) + cur.textContent.length;
        return list;
    }, new Array(textNodes.length).fill(0));
    let fullstr = textNodes.reduce((pre, cur) => (pre+cur.textContent), "");
    let indexs = findAllIndexs(fullstr, substr);

    if (indexs.length == 0) return [];

    let ranges = [];
    let caretAt = 0;
    let caretAtNode = 0;

    for (let i = 0; i < indexs.length; i++) {
        let range = new Range();
        caretAt = indexs[i];
        while (textLength[caretAtNode] < caretAt) caretAtNode++;
        range.setStart(textNodes[caretAtNode], caretAt - textLength[caretAtNode-1]??0);

        caretAt += substr.length;
        while (textLength[caretAtNode] < caretAt) caretAtNode++;
        range.setEnd(textNodes[caretAtNode], caretAt - textLength[caretAtNode-1]??0);

        ranges.push(range);
    }

    return ranges;
}

function getAllTextNodes(father) {
    const walker = document.createTreeWalker(father, NodeFilter.SHOW_TEXT);
    let nodes = [];
    let current;
    while ((current = walker.nextNode()) != null) nodes.push(current);

    return nodes;
}

function findAllIndexs(str, sub) {
    let begin = 0;
    let indexs = [];
    let at;
    while ((at = str.indexOf(sub, begin)) > 0) {
        indexs.push(at);
        begin = at + sub.length;
    }
    return indexs;
}

export { createFinder };