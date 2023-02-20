export default class BallObject {
    /**
     * 
     * @param {THREE.Scene} scene 
     * @param {string} type 
     * @param {THREE.Vector3} position 
     */
    constructor(scene) {
        this.scene = scene
    }

    /**
     * 
     * @param {string} type 
     * @returns 
     */
    create(type) {
        this.type = type
        const ballGeometry = new THREE.SphereGeometry(0.4, 10, 10);
        const ballMaterial = new THREE.MeshPhongMaterial({
            color: type == 'good_ball' ? 0x00ff00 : 0xff0000,
        });

        ballMaterial.reflectivity = 1
        ballMaterial.refractionRatio = 1
        ballMaterial.shininess = 100
        this.ball = new THREE.Mesh(ballGeometry, ballMaterial)
        this.ball.castShadow = true;
        this.ball.receiveShadow = true;
        this.ballBB = new THREE.Sphere(this.ball.position, 0.2)
        this.scene.add(this.ball)
        return this
    }

    /**
     * 
     * @param {THREE.Vector3} position 
     * @returns 
     */
    setPosition(position) {
        this.ball.position.set(position.x, position.y, position.z)
        return this
    }

    hide() {
        this.scene.remove(this.ball)
    }

    show() {
        this.scene.add(this.ball)
    }
}