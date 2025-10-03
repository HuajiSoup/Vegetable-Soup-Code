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
    constructor(parent, name) {
        super(parent, name);
        this.ext = getExtName(name);
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
    }
}

export function getExtName(filename) {
    let extAt = filename.lastIndexOf(".");
    return extAt >= 0 ? filename.slice(extAt+1) : undefined;
}

export { FileNode, DirNode };