export default class PlayerObject {

    /**
     * 
     * @param {THREE.Scene} scene 
     */
    constructor(scene) {
        const objGeometry = new THREE.BoxGeometry(1, 1, 1);

        console.log(objGeometry);
        const objMaterial = new THREE.MeshLambertMaterial({
            color: 0x00ff00,
        });

        this.player = new THREE.Mesh(objGeometry, objMaterial)
        this.player.position.setY(0.5)
        this.player.castShadow = true;
        this.player.receiveShadow = true;
        scene.add(this.player)
    }

    updatePlayer() {
        this.player.position.z -= 0.05
    }
}