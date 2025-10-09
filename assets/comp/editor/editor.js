import { create, hljs, $, $s } from "../../common.js";
import { createFinder } from "../finder/finder.js";
import { rebuildResizer } from "../resizer/resizer.js";

import { writeRootToLocal } from "../../index/index.js";

function createEditor() {
    let editor = create("div", "editor");
    let filesList = create("div", "files-list");
    let listContainer = create("div", "container");
    let options = create("div", "options");
    let optionSplit = create("span", "split");
    let splitViewLayer = create("div", "split-view");

    listContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("exit")) return;
        let selected = e.target.closest(".file");
        editorFocusOnFile(editor, selected);
    });
    optionSplit.addEventListener("click", () => {
        splitEditor(editor, true);
    });
    editor.ondragenter = () => {
        splitViewLayer.style.display = "block";
    }
    splitViewLayer.ondragleave = () => {
        splitViewLayer.style.display = "none";
    }
    splitViewLayer.ondragover = (e) => {
        let width = editor.clientWidth;
        let height = editor.clientHeight;
        let offsetX = e.clientX - editor.offsetLeft;
        let offsetY = e.clientY - editor.offsetTop;
        console.log(offsetX);
        
        if (offsetX * 2 > width) {
            splitViewLayer.setAttribute("data-pos", "right");
        } else if (offsetY * 2 > height) {
            splitViewLayer.setAttribute("data-pos", "bottom");
        } else {
            splitViewLayer.setAttribute("data-pos", "center");
        }
    }
    editor.onkeydown = getTextareaKeydownFunc(editor);
    
    options.appendChild(optionSplit);
    filesList.appendChild(listContainer);
    filesList.appendChild(options);
    editor.appendChild(filesList);
    editor.appendChild(splitViewLayer);
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
            rebuildResizer(editorParent, true);
        } else {
            let newBox = create("div", "editor-box hrz");
            newBox.style.height = dest.clientHeight + "px";
            newBox.appendChild(editorParent.replaceChild(newBox, dest));
            newBox.appendChild(clone);
            rebuildResizer(editorParent, false); // parent is !horizonal
            rebuildResizer(newBox, true);
        }
    } else {
        clone = createEditor();
        editorOpenFile(clone, dest.querySelector(".file[data-focus='1']").getAttribute("data-filepath"));
        dest.style.height = clone.style.height = dest.clientHeight / 2 + "px";

        if (editorParent.classList.contains("vtc")) {
            editorParent.appendChild(clone);
            rebuildResizer(editorParent, false);
        } else {
            let newBox = create("div", "editor-box vtc");
            newBox.style.width = dest.ClientWidth + "px";
            newBox.appendChild(editorParent.replaceChild(newBox, dest));
            newBox.appendChild(clone);
            rebuildResizer(editorParent, true);
            rebuildResizer(newBox, false);
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

    editor.querySelector(".textbox[data-focus='1']")?.
        setAttribute("data-focus", 0);
    editor.querySelector(`.textbox[data-filepath="${filename}"]`)?.
        setAttribute("data-focus", 1);

    editor.querySelector(".files-list .file[data-focus='1']")?.
        setAttribute("data-focus", 0);
    editor.querySelector(`.files-list .file[data-filepath="${filename}"]`)?.
        setAttribute("data-focus", 1);
}

function getTextareaInputFunc(textarea, codeArea, linebar, filebar) {
    return (() => {
        let content = textarea.value;
        let line = content.split("\n").length;

        // auto expand
        textarea.setAttribute("rows", line);
        setLineBar(linebar, line);

        // change to unsaved
        filebar.setAttribute("data-unsaved", "1");

        // highlight
        codeArea.textContent = content;
        codeArea.removeAttribute("data-highlighted");
        codeArea.className = "hljs";
        hljs.highlightElement(codeArea);
    });
}

function getTextareaKeydownFunc(editor) {
    return ((e) => {
        if (e.ctrlKey && e.key == "s") {
            // Ctrl + Save
            e.preventDefault();
            let focusTextbox = editor.querySelector(".textbox[data-focus='1']");
            let focusTextarea = focusTextbox.querySelector("textarea");
            let filepath = focusTextbox.getAttribute("data-filepath");
            let file = globalThis.fileDict[filepath];
            
            file.content = focusTextarea.value;
            writeRootToLocal();

            // filecontent sync
            $s(`#editor .file[data-filepath="${filepath}"]`).forEach(file => {
                file.removeAttribute("data-unsaved");
            });
            $s(`#editor .textbox[data-filepath="${filepath}"] textarea`).forEach(textarea => {
                textarea.value = focusTextarea.value;
            });
        } else if (e.ctrlKey && e.key == "f") {
            // Ctrl + Find
            let textarea = e.target;
            if (textarea.tagName != "TEXTAREA") return;
            
            e.preventDefault();
            textarea.closest(".code-layer").appendChild(createFinder(textarea.closest(".textbox")));
        } else if (e.ctrlKey && e.key == "\\") {
            e.preventDefault();
            e.altKey ? splitEditor(editor, false) : splitEditor(editor, true);
        }
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
            "draggable": true,
        }
    );
    let divIcon = create("span", "icon");
    let divExit = create("span", "exit");
    divIcon.style.backgroundImage = `url("./res/ext/${file.ext}.svg")`;

    // textbox
    let divText = create("div", "textbox", undefined, 
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
    
    file.ondragstart = () => {globalThis.pressing = true;}
    file.ondragend = () => {globalThis.pressing = false;}
    divExit.addEventListener("click", () => {
        divFile.remove();
        divText.remove();

        if (!editor.querySelector(".file")) {
            // if delete the last file, delete the whole editor;
            let editorBox = editor.parentNode;
            editor.remove();

            let filesLeft = editorBox.querySelectorAll(".editor");
            if (filesLeft.length == 1) {
                // if delete the last editor of a box, unpack the box;
                editorBox.parentNode.replaceChild(filesLeft[0], editorBox);
            }
            focusOnEditor($("#editor .editor"));
        } else {
            editorFocusOnFile(editor, editor.querySelector(".file"));
        }
    }, { once : true });
    let oninput = getTextareaInputFunc(textArea, code, linebar, divFile);
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