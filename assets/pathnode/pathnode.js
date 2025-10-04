class PathNode {
    parent;
    name;
    constructor(parent, name) {
        this.parent = parent;
        this.name = name;
        if (parent instanceof DirNode) {
            parent.addChild(this);
        }
    }
    rename(name) {
        this.name = name;
    }
    getFullPath() {
        return this.parent
            ? `${this.parent.getFullPath()}/${this.name}`
            : ".";
    }
}

class FileNode extends PathNode {
    ext;
    content;
    constructor(parent, name) {
        super(parent, name);
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
    constructor(parent, name) {
        super(parent, name);
        this.children = new Array(0);
    }
    addChild(pathnode) {
        this.children.push(pathnode);
        pathnode.parent = this;

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
    walkEach(callback) {
        callback(this);
        for (const child of this.children) {
            if (child instanceof DirNode) {
                child.walkEach(callback);
            } else {
                callback(child);
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

export { DirNode, FileNode, getFileDictFromTree };