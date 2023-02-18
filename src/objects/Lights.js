export default class Lights {

    /**
     * 
     * @param {THREE.Scene} scene 
     */
    constructor(scene) {
        this.ambientLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
        this.ambientLight.position.set(0.5, 2, 0.5)
        scene.add(this.ambientLight);

        this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.3, 50);
        this.directionalLight.position.set(1, 2, -1);
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.mapSize.width = 2048;
        this.directionalLight.shadow.mapSize.height = 2048;
        this.directionalLight.shadow.radius = 10;

        scene.add(this.directionalLight)
    }

    createBall() {

    }
}