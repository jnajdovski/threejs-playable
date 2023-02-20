export class PoolObject {
    constructor(data) {
        this.data = data;
        this.nextFree = null;
        this.previousFree = null;
    }
}

export default class Pool {
    constructor(objCreator, objReseter, initialSize = 200) {
        this.pool = [];
        this.objCreator = objCreator;
        this.objReseter = objReseter;
        for (let i = 0; i < initialSize; i++) {
            this.addNewObject(this.newPoolObject());
        }
    }

    /**
     * 
     * @param {PoolObject} obj 
     * @returns 
     */
    addNewObject(obj) {
        this.pool.push(obj);
        this.release(obj);
        return obj;
    }

    release(poolObject) {
        poolObject.free = true;

        poolObject.nextFree = null;
        poolObject.previousFree = this.lastFree;

        if (poolObject.previousFree) {
            this.lastFree.nextFree = poolObject;
        } else {
            this.nextFree = poolObject;
        }

        this.lastFree = poolObject;

        this.objReseter(poolObject);
    }

    getFree() {
        const freeObject = this.nextFree ? this.nextFree : this.addNewObject(this.newPoolObject());
        freeObject.free = false;

        this.nextFree = freeObject.nextFree;

        if (!this.nextFree) this.lastFree = null;

        return freeObject;
    }

    newPoolObject() {
        const data = this.objCreator();
        return new PoolObject(data, this.lastFree, this.nextFree);
    }

    releaseAll() {
        this.pool.forEach(item => this.release(item));
    }
}