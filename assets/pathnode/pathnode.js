class PathNode {
    father;
    name;
    constructor(father, name) {
        this.father = father;
        this.name = name;
        if (father instanceof DirNode) {
            father.addChild(this);
        }
    }
    rename(name) {
        this.name = name;
    }
    getFullPath() {
        return this.father
            ? `${this.father.getFullPath()}/${this.name}`
            : ".";
    }
}

class FileNode extends PathNode {
    ext;
    content;
    constructor(father, name) {
        super(father, name);
        this.ext = getExtName(name);
        this.content = "";
    }
    rename(name) {
        this.name = name;
        this.ext = getExtName(name);
    }
}

class DirNode extends PathNode {
    children;
    constructor(father, name) {
        super(father, name);
        this.children = new Array(0);
    }
    addChild(pathnode) {
        this.children.push(pathnode);
        pathnode.father = this;

        this.children.sort((childA, childB) => {
            if (childA instanceof DirNode && childB instanceof FileNode) {
                return -1;
            } else if (childA instanceof FileNode && childB instanceof DirNode) {
                return 1;
            } else {
                return childA.name <= childB.name ? -1 : 1;
            }
        });
    }
    deleteChild(pathnode) {
        this.children.splice(this.children.indexOf(pathnode), 1);
        pathnode.father = null;
        return pathnode;
    }
    walkEach(callback) {
        callback(this, this.father);
        for (const child of this.children) {
            if (child instanceof DirNode) {
                child.walkEach(callback);
            } else {
                callback(child, this);
            }
        }
    }
}

function getExtName(filename) {
    let extAt = filename.lastIndexOf(".");
    return extAt >= 0 ? filename.slice(extAt + 1) : "";
}
function getFileDictFromTree(node) {
    let dict = {};
    node.walkEach((pathnode) => {
        dict[pathnode.getFullPath()] = pathnode;
    });

    return dict;
}
function setNodeParent(father, child) {
    child.father = father;
    father.addChild(child);
}
function copyFileWithoutParent(obj) {
    // avoid father.children->child.father->...
    if (Array.isArray(obj)) {
        let copy = new Array(obj.length);
        for (let i = 0; i < obj.length; i++) {
            copy[i] = copyFileWithoutParent(obj.at(i));
        }
        return copy;
    } else if (typeof obj == "object" && obj != null) {
        let copy = Object.create(obj);
        copy.father = undefined;
        for (const key in obj) {
            if (Object.hasOwn(obj, key) && key != "father") {
                copy[key] = copyFileWithoutParent(obj[key]);
            }
        }
        return copy;
    }
    return obj;
}

function copyFile(pathnode) {
    let copy = copyFileWithoutParent(pathnode);
    if (copy instanceof DirNode) {
        copy.walkEach((child, father) => {
            child.father = father
        });
    }

    return copy;
}

export { DirNode, FileNode, setNodeParent, getFileDictFromTree, copyFile };