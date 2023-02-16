export default class Lights {

    /**
     * 
     * @param {THREE.Scene} scene 
     */
    constructor(scene) {
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.ambientLight.position.set(0.5, 2, 0.5)
        scene.add(this.ambientLight);

        this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        this.directionalLight.position.set(-5, 25, -1);
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.camera.near = 0.01;
        this.directionalLight.shadow.camera.far = 500;
        this.directionalLight.shadow.mapSize.width = 1024;
        this.directionalLight.shadow.mapSize.height = 1024;
        this.directionalLight.shadow.radius = 10;
        this.directionalLight.shadow.bias = -0.00006;

        scene.add(this.directionalLight)
    }
}