export default class GroundObject {

    /**
     * 
     * @param {THREE.Scene} scene 
     */
    constructor(scene) {
        const groundGeo = new THREE.BoxGeometry(8, 0.2, 150)
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0xff0000,
        });

        this.ground = new THREE.Mesh(groundGeo, groundMaterial)
        this.ground.position.setZ(-65)
        this.ground.castShadow = true;
        this.ground.receiveShadow = true;
        scene.add(this.ground)
    }
}