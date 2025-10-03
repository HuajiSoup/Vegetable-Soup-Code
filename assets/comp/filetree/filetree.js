import { FileNode, DirNode } from "../../pathnode/pathnode.js";

function applyFileTree(pathnode, box, depth=0) {
    if (depth == 0) {
        // `root` dir is invisible
        box.innerHTML = "";
    } else {
        let newDiv = document.createElement("div");
        newDiv.className = "node";
        newDiv.innerHTML = pathnode.name;
        newDiv.style.paddingLeft = `${20 * depth}px`;
        newDiv.setAttribute("data-filepath", pathnode.getFullPath());
        box.appendChild(newDiv);
    }

    if (pathnode instanceof DirNode) {
        let newDivBox = document.createElement("div");
        newDivBox.className = "node-box";
        for (const child of pathnode.children) {
            applyFileTree(child, newDivBox, depth+1);
        }
        box.appendChild(newDivBox);
    }
}
// no memory leak cuz `let` variable removes itself

export { applyFileTree };