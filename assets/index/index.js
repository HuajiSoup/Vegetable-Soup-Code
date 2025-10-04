import { $, $s } from "../common.js";

import { addResizer } from "../comp/resizer/resizer.js";
import { initPanelCards } from "../panels/panels.js";

import { FileNode, DirNode } from "../pathnode/pathnode.js";
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

function initFileTree() {
    $("#card-filetree .card").addEventListener("click", () => {
        let selected = $("#card-filetree .node:hover");
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initSectionIcon();
    initResizer();
    initPanelCards();

    let fileTree = $("#card-filetree .card");

    // test
    let root = new DirNode(undefined, "");
    let dirA = new DirNode(root, "dirA");
    let fileA = new FileNode(root, "fileA.txt")
    let dirB = new DirNode(root, "dirB");
    let fileB = new FileNode(dirB, "fileB.cmd");
    let dirC = new DirNode(dirB, "dirC");
    
    applyFileTree(root, fileTree);
    
});