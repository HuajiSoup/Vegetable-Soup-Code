import { $, $s, hljs, create } from "../common.js";

import { addResizer, rebuildResizer } from "../comp/resizer/resizer.js";
import { initPanelCards } from "../panels/panels.js";
import { createEditor, editorOpenFile, editorFocusOnFile, focusOnEditor } from "../comp/editor/editor.js";

import { FileNode, DirNode, getFileDictFromTree, setNodeParent, copyFile } from "../pathnode/pathnode.js";
import { applyFileTree } from "../comp/filetree/filetree.js";
import { closeContextMenu, showContextMenu, createContextMenu } from "../comp/contextmenu/menu.js";

globalThis.pressing = false;
globalThis.fileDict = {};
globalThis.copiedFile = null;

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
    rebuildResizer($("#func #panel-file"), false);
}

const refreshFileTree = () => {
    globalThis.fileDict = getFileDictFromTree(root);
    applyFileTree(root, document.querySelector("#card-filetree .card"));
}

const fileOperation = {
    fileDelete : () => {
        let selected = $("#card-filetree .node[data-onmenu='1']");
        let selectedFile = globalThis.fileDict[selected.getAttribute("data-filepath")];
        selectedFile.father.deleteChild(selectedFile);
        selectedFile = undefined;
        writeRootToLocal();
        refreshFileTree();
    },
    fileCopy : () => {
        let selected = $("#card-filetree .node[data-onmenu='1']");
        if (selected) {
            globalThis.copiedFile = copyFile(globalThis.fileDict[selected.getAttribute("data-filepath")]);
        }
    },
    fileCut : () => {
        let selected = $("#card-filetree .node[data-onmenu='1']");
        if (selected) {
            let selectedFile = globalThis.fileDict[selected.getAttribute("data-filepath")];
            selectedFile.father.deleteChild(selectedFile);
            globalThis.copiedFile = copyFile(selectedFile);
            selectedFile = undefined;
            writeRootToLocal();
            refreshFileTree();
        }
    },
    filePaste : () => {
        let selected = $("#card-filetree .node[data-onmenu='1']");
        let copiedFile = globalThis.copiedFile;
        if (selected) {
            let selectedFile = globalThis.fileDict[selected.getAttribute("data-filepath")];
            if (selectedFile instanceof DirNode) {
                setNodeParent(selectedFile, copiedFile);
            }
        } else {
            setNodeParent(root, copiedFile);
        }
        writeRootToLocal();
        refreshFileTree();
    },
    newFile : () => {
        let selected = $("#card-filetree .node[data-onmenu='1']");
        let selectedFile = globalThis.fileDict[selected?.getAttribute("data-filepath")] ?? root;
        if (selectedFile instanceof DirNode) {
            new FileNode(selectedFile, "新建文本文件.txt");
            writeRootToLocal();
            refreshFileTree();
        }
    },
    newDir : () => {
        let selected = $("#card-filetree .node[data-onmenu='1']");
        let selectedFile = globalThis.fileDict[selected?.getAttribute("data-filepath")] ?? root;
        if (selectedFile instanceof DirNode) {
            new DirNode(selectedFile, "新建文件夹");
            writeRootToLocal();
            refreshFileTree();
        }
    },
    fileRename : () => {
        let selected = $("#card-filetree .node[data-onmenu='1']");
        let filename = selected.getAttribute("data-filepath");
        if (!filename) return;
        let selectedFile = globalThis.fileDict[filename];
        let editable = selected.querySelector("p");
        editable.setAttribute("contenteditable", true);

        let oldName = editable.textContent;
        editable.addEventListener("blur", () => {
            let newName = editable.textContent;
            editable.setAttribute("contenteditable", false);
            if (!newName.includes("/") && 
                !selectedFile.father.children.some(file => file.name == newName)
            ) {
                selectedFile.name = newName;
                writeRootToLocal();
            } else {
                // same name detected -> restore name
                editable.textContent = oldName;
            }
        }, { once : true });

        editable.focus();
    },
};
const contextMenus = {
    menuOfFile: createContextMenu({
        "复制": fileOperation.fileCopy,
        "剪切": fileOperation.fileCut,
        "重命名": fileOperation.fileRename,
        "删除": fileOperation.fileDelete
    }),
    menuOfDir: createContextMenu({
        "新建文件": fileOperation.newFile,
        "新建文件夹": fileOperation.newDir,
        "复制": fileOperation.fileCopy,
        "剪切": fileOperation.fileCut,
        "粘贴": fileOperation.filePaste,
        "重命名": fileOperation.fileRename,
        "删除": fileOperation.fileDelete,
    }),
    menuOfNothing: createContextMenu({
        "新建文件": fileOperation.newFile,
        "新建文件夹": fileOperation.newDir,
    }),
};
function initFileTree() {
    $("#card-filetree .card").addEventListener("click", (e) => {
        let selected = e.target.closest(".node");
        if (selected) {
            let filepath = selected.getAttribute("data-filepath");
            let file = globalThis.fileDict[filepath];

            if (file instanceof DirNode) {
                selected.setAttribute("data-open", 
                    selected.getAttribute("data-open") == 1 ? 0 : 1
                );
            } else {
                // open file to current editor
                let destEditor;
                if (destEditor = $(".editor[data-focus='1']")) {
                    // open file & de-duplication
                    let existed = destEditor.querySelector(`.file[data-filepath="${filepath}"]`);
                    if (existed) {
                        editorFocusOnFile(destEditor, existed);
                    } else {
                        editorOpenFile(destEditor, filepath);
                    }
                } else {
                    destEditor = createEditor();
                    destEditor.setAttribute("data-focus", "1");
                    editorOpenFile(destEditor, filepath);
                    $("#editor").appendChild(destEditor);
                }
            }
        }
    });
    $("#card-filetree .card").addEventListener("contextmenu", (e) => {
        e.preventDefault();

        let selected = e.target.closest(".node");
        if (selected) {
            $s("#card-filetree .node").forEach(node => {
                node.setAttribute("data-onmenu", node == selected ? 1 : 0);
            });
            let selectedFile = globalThis.fileDict[selected.getAttribute("data-filepath")];
            if (selectedFile instanceof FileNode) {
                showContextMenu(contextMenus.menuOfFile, e.pageX, e.pageY);
            } else {
                showContextMenu(contextMenus.menuOfDir, e.pageX, e.pageY);
            }
        } else {
            // empty place
            showContextMenu(contextMenus.menuOfNothing, e.pageX, e.pageY);
        }

        // just close, whatever
        document.addEventListener("mouseup", () => {
            $s(".contextmenu").forEach(menu => closeContextMenu(menu));
        }, { once : true });
    });
}

const root = new DirNode(undefined, "");
globalThis.fileDict["."] = root;
function writeRootToLocal() {
    // FOR `root` ONLY
    // save content of files and dirs(null),
    const info = {};
    root.walkEach(filenode => {
        info[filenode.getFullPath()] = filenode.content ?? null;
    });
    window.localStorage.setItem("vegetable_soup_fileroot", JSON.stringify(info));
}
function readRootFromLocal() {
    // FOR `root` ONLY
    // read content of files, btw judge file/dir
    // read in DFS order, to ensure father is created before sons find their fathers
    const infoStr = window.localStorage.getItem("vegetable_soup_fileroot");
    if (!infoStr) return;

    const info = JSON.parse(infoStr);
    let filenames = Object.keys(info).sort((name1, name2) => name1.length - name2.length);
    
    for (let i = 1; i < filenames.length; i++) {
        // when i == 0, its the file with the shortest name: root(".")
        // we avoid adding root to itself's children list
        const fullPath = filenames[i];
        const content = info[fullPath];
        let fatherName = fullPath.slice(0, fullPath.lastIndexOf("/"));
        let fileName = fullPath.slice(fullPath.lastIndexOf("/") + 1);
        let father = fileDict[fatherName];

        let file;
        if (content != null) {
            file = new FileNode(father, fileName);
            file.content = content;
        } else {
            file = new DirNode(father, fileName);
        }

        globalThis.fileDict[fullPath] = file;
    }
}
function clearRootLocal() {
    window.localStorage.removeItem("vegetable_soup_fileroot");
}

readRootFromLocal();

document.addEventListener("DOMContentLoaded", () => {
    initSectionIcon();
    initResizer();
    initPanelCards();
    document.body.append(contextMenus.menuOfFile, contextMenus.menuOfDir, contextMenus.menuOfNothing);
    initFileTree();

    refreshFileTree();
    
    // test
    // let dirA = new DirNode(root, "dirA");
    // let fileA = new FileNode(root, "fileA.txt");
    // let dirB = new DirNode(root, "dirB");
    // let fileB = new FileNode(dirB, "fileB.cmd");
    // let dirC = new DirNode(dirB, "dirC");
    // let fileC = new FileNode(dirC, "fileOOO.kl");
    // fileA.content = '#include <stdio.h>\n\nint main(void) {\n  prinf("Hello world im gay!!!!");\n}';
    // fileC.content = 'import numpy as npy\nwhile False:\n    break\n';
    

    // initEditor
    $("#editor").addEventListener("mouseup", (e) => {
        let selected = e.target.closest(".editor");
        if (!selected) return; // it happens when close a file
        focusOnEditor(selected);
    });
});

export { writeRootToLocal };