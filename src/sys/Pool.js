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
        // flag as free
        poolObject.free = true;

        // set in the queue
        poolObject.nextFree = null;
        poolObject.previousFree = this.lastFree;

        // if we had a last free, set the last free's next as the new poolObject
        // otherwise, this is the first free!
        if (poolObject.previousFree) {
            this.lastFree.nextFree = poolObject;
        } else {
            this.nextFree = poolObject;
        }

        // set the new object as the last in the queue
        this.lastFree = poolObject;

        // reset the object if needed
        this.objReseter(poolObject);
    }

    getFree() {
        // if we have a free one, get it - otherwise create it
        const freeObject = this.nextFree ? this.nextFree : this.addNewObject(this.newPoolObject());

        // flag as used
        freeObject.free = false;

        // the next free is the object's next free
        this.nextFree = freeObject.nextFree;

        // if there's nothing afterwards, the lastFree is null as well
        if (!this.nextFree) this.lastFree = null;

        // return the now not free object
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