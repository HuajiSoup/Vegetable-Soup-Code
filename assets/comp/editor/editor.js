import { create } from "../../common.js";

function addEditor(dest, horizonal = true) {
    let editor = document.createElement("div");
    editor.classList.add("editor");
    //
}

function openFile(editor, filepath) {
    let file = window.fileDict[filepath];

    // bar
    let divFile = create("div", "file");
    let divIcon = create("span", "icon");
    let divExit = create("span", "exit");
    divFile.setAttribute("data-file", filepath);
    divIcon.style.backgroundImage = `url("./res/ext/${file.ext}.svg")`;
    divExit.addEventListener("click", () => {
        //
    }, { once : true});
    divFile.appendChild(divIcon);
    divFile.appendChild(file.name);
    divFile.appendChild(divExit);
    editor.querySelector(".files-list").appendChild(divFile);

    // textarea
    let divText = create("div", "text-box");
}

export { openFile };