import {
    keyDown
} from "../utils/utils";

export default class PlayerObject {

    /**
     * 
     * @param {THREE.Scene} scene 
     */
    constructor(scene) {
        this.movementSpeed = 1.8
        this.moveLeft = false
        this.moveRight = false
        const objGeometry = new THREE.BoxGeometry(1, 1, 1);
        const objMaterial = new THREE.MeshLambertMaterial({
            color: 0x00ff00,
        });

        this.player = new THREE.Mesh(objGeometry, objMaterial)
        this.player.position.setY(1)
        this.player.castShadow = true;
        this.player.receiveShadow = true;

        window.addEventListener('keydown', (event) => {
            if (keyDown(event) === 'left') this.moveLeft = true
            if (keyDown(event) === 'right') this.moveRight = true
        });

        window.addEventListener('keyup', (event) => {
            if (keyDown(event) === 'left') this.moveLeft = false
            if (keyDown(event) === 'right') this.moveRight = false
        });

        scene.add(this.player)
    }

    updatePlayer(delta) {
        const actualMoveSpeed = delta * this.movementSpeed;
        this.player.position.z -= 0.05
        if (this.moveRight) this.player.translateX(actualMoveSpeed)
        if (this.moveLeft) this.player.translateX(-actualMoveSpeed)
    }
}