import { $, $s } from "../common.js";
import { hljs } from "../common.js";

import { addResizer } from "../comp/resizer/resizer.js";
import { initPanelCards } from "../panels/panels.js";
import { openFile, createEditor } from "../comp/editor/editor.js";

import { FileNode, DirNode, getFileDictFromTree } from "../pathnode/pathnode.js";
import { applyFileTree } from "../comp/filetree/filetree.js";

function initSectionIcon() {
    $s("#sidebar .section").forEach(sec => {
        // css
        let icon = `./res/icon/${ sec.getAttribute("data-ico") }.svg`;
        let icoElem = document.createElement("div");
        icoElem.style["mask-image"] = icoElem.style["-webkit-mask-image"] = `url("${icon}")`;
        sec.appendChild(icoElem);
    });

    $("#sidebar .up-box").addEventListener("click", (e) => {
        let selected = e.target.closest(".section").id;
        $s(".up-box .section").forEach(sec => {
            sec.setAttribute("data-focus", sec.id == selected ? 1 : 0);
        });
        $s("#func .panel").forEach(panel => {
            panel.style["display"] = (
                panel.id == "panel-" + selected ? "flex" : "none"
            );
        });
    });
}

function initResizer() {
    addResizer($("#func"), true, 200);
}

document.addEventListener("DOMContentLoaded", () => {
    initSectionIcon();
    initResizer();
    initPanelCards();
    
    let root = new DirNode(undefined, "");
    
    // test
    let dirA = new DirNode(root, "dirA");
    let fileA = new FileNode(root, "fileA.txt");
    let dirB = new DirNode(root, "dirB");
    let fileB = new FileNode(dirB, "fileB.cmd");
    let dirC = new DirNode(dirB, "dirC");
    let fileC = new FileNode(dirC, "fileOOO.kl");
    fileA.content = '#include <stdio.h>\n\nint main(void) {\n  prinf("Hello world im gay!!!!");\n}';
    applyFileTree(root, document.querySelector("#card-filetree .card"));
    // test

    // initFiletree
    window.fileDict = getFileDictFromTree(root);
    $("#card-filetree .card").addEventListener("click", () => {
        let selected;
        if (selected = $("#card-filetree .node:hover")) {
            let filepath = selected.getAttribute("data-filepath");
            let file = window.fileDict[filepath];

            if (file instanceof DirNode) {
                selected.setAttribute("data-open", 
                    selected.getAttribute("data-open") == 1 ? 0 : 1
                );
            } else {
                // open file to current editor
                let destEditor;
                if (destEditor = $(".editor[data-focus='1']")) {
                    openFile(destEditor, filepath);
                } else {
                    destEditor = createEditor();
                    destEditor.setAttribute("data-focus", "1");
                    openFile(destEditor, filepath);
                    $("#editor").appendChild(destEditor);
                }
            }
        }
    });

    // initEditor
    // $("#editor")
});