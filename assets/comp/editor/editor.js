import { create, hljs } from "../../common.js";

function addEditor(dest, horizonal = true) {
    let editor = document.createElement("div");
    editor.classList.add("editor");
    //
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

function openFile(editor, filepath) {
    let file = window.fileDict[filepath];
    let content = file.content;
    let line = content.split("\n").length;

    // file-list
    let divFile = create("div", "file", undefined, 
        {
            "data-file" : filepath,
            "data-open" : false,
        }
    );
    let divIcon = create("span", "icon");
    let divExit = create("span", "exit");

    divIcon.style.backgroundImage = `url("./res/ext/${file.ext}.svg")`;
    divExit.addEventListener("click", () => {
        //
    }, { once : true });

    divFile.appendChild(divIcon);
    divFile.innerHTML += file.name;
    divFile.appendChild(divExit);
    editor.querySelector(".files-list .container").appendChild(divFile);


    // text-box
    let divText = create("div", "text-box", undefined, 
        {
            "data-file" : filepath,
            "data-open" : false,
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
    
    let oninput = getTextareaInputFunc(textArea, code, linebar);
    let onscroll = () => { code.scrollLeft = textArea.scrollLeft };
    textArea.oninput = oninput;
    textArea.onscroll = onscroll;
    setLineBar(linebar, line);
    
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
}

export { openFile };