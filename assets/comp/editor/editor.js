import { create, hljs, $, $s } from "../../common.js";

function createEditor() {
    let editor = create("div", "editor");
    let filesList = create("div", "files-list");
    let listContainer = create("div", "container");
    let options = create("div", "options");
    let optionSplit = create("span", "split");
    listContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("exit")) return;
        let selected = e.target.closest(".file");
        editorFocusOnFile(editor, selected);
    });
    optionSplit.addEventListener("click", () => {
        splitEditor(editor, true);
    });
    
    options.appendChild(optionSplit);
    filesList.appendChild(listContainer);
    filesList.appendChild(options);
    editor.appendChild(filesList);
    return editor;
}

function splitEditor(dest, horizonal = true) {
    let editorParent = dest.parentNode;
    // if direction matches: half-cut & copy
    // else: create new editor-box
    let clone;
    if (horizonal) {
        clone = createEditor();
        editorOpenFile(clone, dest.querySelector(".file[data-focus='1']").getAttribute("data-filepath"));
        dest.style.width = clone.style.width = dest.clientWidth / 2 + "px";

        if (editorParent.classList.contains("hrz")) {
            dest.after(clone);
        } else {
            let newBox = create("div", "editor-box hrz");
            newBox.appendChild(editorParent.replaceChild(newBox, dest));
            newBox.appendChild(clone);
        }
    } else {
        clone = createEditor();
        editorOpenFile(clone, dest.querySelector(".file[data-focus='1']").getAttribute("data-filepath"));
        dest.style.height = clone.style.height = dest.clientHeight / 2 + "px";

        if (editorParent.classList.contains("vtc")) {
            editorParent.appendChild(clone);
        } else {
            let newBox = create("div", "editor-box vtc");
            newBox.appendChild(editorParent.replaceChild(newBox, dest));
            newBox.appendChild(clone);
        }
    }
}

function focusOnEditor(selected) {
    $s("#editor .editor").forEach(editor => {
        editor.setAttribute("data-focus", editor == selected ? "1" : "0");
    });
}

function editorFocusOnFile(editor, selected) {
    let filename = selected.getAttribute("data-filepath");

    editor.querySelector(".text-box[data-focus='1']")?.
        setAttribute("data-focus", 0);
    editor.querySelector(`.text-box[data-filepath="${filename}"]`)?.
        setAttribute("data-focus", 1);

    editor.querySelector(".files-list .file[data-focus='1']")?.
        setAttribute("data-focus", 0);
    editor.querySelector(`.files-list .file[data-filepath="${filename}"]`)?.
        setAttribute("data-focus", 1);
}

function getTextareaInputFunc(textArea, codeArea, linebar) {
    return (() => {
        let content = textArea.value;
        let line = content.split("\n").length;

        // auto expand
        textArea.setAttribute("rows", line);
        setLineBar(linebar, line);

        // highlight
        codeArea.textContent = content;
        codeArea.removeAttribute("data-highlighted");
        codeArea.className = "hljs";
        hljs.highlightElement(codeArea);
    });
}

function setLineBar(linebar, line) {
    let lineOld = parseInt(linebar.getAttribute("data-cnt")) ?? 0;
    if (lineOld != line) {
        if (lineOld < line) {
            for (let i = lineOld+1 ; i <= line ; i++) {
                let newLine = create("div", "line", undefined, {"data-at" : i});
                newLine.innerHTML = i;
                linebar.appendChild(newLine);
            }
        } else if (lineOld > line) {
            for (let _ = lineOld ; _ > line ; _--) {
                linebar.removeChild(linebar.lastChild);
            }
        }
        linebar.setAttribute("data-cnt", line);
    }
}

function editorOpenFile(editor, filepath) {
    let file = globalThis.fileDict[filepath];
    let content = file.content;
    let line = content.split("\n").length;

    // file-list
    let divFile = create("div", "file", undefined, 
        {
            "data-filepath" : filepath,
            "data-focus" : 0,
        }
    );
    let divIcon = create("span", "icon");
    let divExit = create("span", "exit");
    divIcon.style.backgroundImage = `url("./res/ext/${file.ext}.svg")`;

    // text-box
    let divText = create("div", "text-box", undefined, 
        {
            "data-filepath" : filepath,
            "data-focus" : 0,
        }
    );
    let divTextContainer = create("div", "container");
    let linebar = create("div", "line-bar", undefined, {"data-cnt": 0});
    let codeLayer = create("div", "code-layer");
    let textArea = create("textarea", undefined, undefined, 
        {
            "placeholder" : "Type text here...", 
            "spellcheck" : false,
        }
    );
    let codePre = create("pre");
    let code = create("code");
    
    divExit.addEventListener("click", () => {
        divFile.remove();
        divText.remove();

        if (!editor.querySelector(".file")) {
            // if delete the last file, delete the whole editor;
            let editorBox = editor.parentNode;
            editor.remove();

            let filesLeft = editorBox.querySelectorAll(".editor").length;
            if (filesLeft == 1) {
                editorBox.parentNode.replaceChild(editorBox.firstChild, editorBox);
            }
            focusOnEditor($("#editor .editor"));
        } else {
            editorFocusOnFile(editor, editor.querySelector(".file"));
        }
    }, { once : true });
    let oninput = getTextareaInputFunc(textArea, code, linebar);
    let onscroll = () => { code.scrollLeft = textArea.scrollLeft };
    textArea.oninput = oninput;
    textArea.onscroll = onscroll;
    setLineBar(linebar, line);
    
    divFile.appendChild(divIcon);
    divFile.innerHTML += file.name;
    divFile.appendChild(divExit);
    editor.querySelector(".files-list .container").appendChild(divFile);

    divTextContainer.appendChild(linebar);
    codeLayer.appendChild(textArea);
    codePre.appendChild(code);
    codeLayer.appendChild(codePre);
    divTextContainer.appendChild(codeLayer);
    divText.appendChild(divTextContainer);
    editor.appendChild(divText);

    textArea.value = content;
    oninput();
    onscroll();
    editorFocusOnFile(editor, divFile);
}

export { createEditor, editorOpenFile, editorFocusOnFile, focusOnEditor };