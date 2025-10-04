import { FileNode, DirNode } from "../../pathnode/pathnode.js";
import { create } from "../../common.js";

function applyFileTree(pathnode, box, depth=0) {
    if (depth == 0) {
        // `root` dir is invisible
        box.innerHTML = "";
    } else {
        let newDiv = create("div", "node");
        newDiv.innerHTML = pathnode.name;
        newDiv.setAttribute("data-filepath", pathnode.getFullPath());
        if (pathnode instanceof DirNode) {
            newDiv.style.paddingLeft = `${12 * depth - 12}px`;
            newDiv.setAttribute("data-open", "0");
            newDiv.insertBefore(create("span", "arrow"), newDiv.firstChild);
        } else {
            newDiv.style.paddingLeft = `${12 * depth}px`;
        }

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