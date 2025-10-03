class FileNode {
    parent;
    name;
    constructor(parent, name) {
        this.parent = parent;
        this.name = name;
    }
    rename(name) {
        this.name = name;
    }
}

class File extends FileNode {
    parent;
    name;
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

class Directory extends FileNode {
    parent;
    name;
    children;
    constructor(parent, name) {
        super(parent, name);
        this.children = new Array(0);
    }
    removeChild(fileNode) {
        this.children.push(fileNode);
    }
}

function getExtName(filename) {
    extAt = filename.lastIndexOf(".");
    return extAt >= 0 ? filename.slice(extAt+1) : undefined;
}

export { File, Directory };