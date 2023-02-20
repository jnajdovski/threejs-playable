export default class Particles {
    /**
     * 
     * @param {THREE.Scene} scene 
     */
    constructor(scene) {
        this.scene = scene
        this.particleGroup = new THREE.Group()
        this.particleSprite = new THREE.TextureLoader().load('assets/spark1.png')
        this.numberParticles = Math.random() * 200 + 100
        this.spd = 0.2
        this.color = new THREE.Color()
    }

    makeParticles() {
        this.color.setHSL(0.9, 0.95, 0.8)
        for (let i = 0; i < this.numberParticles; i++) {
            let particleMaterial = new THREE.SpriteMaterial({
                map: this.particleSprite,
                depthTest: false
            });
            this.sprite = new THREE.Sprite(particleMaterial)
            this.sprite.material.blending = THREE.AdditiveBlending
        }
    }

    /**
     * 
     * @param {THREE.Vector3} position 
     */
    explode(position) {
        this.sprite.userData.velocity = new THREE.Vector3(
            Math.random() * this.spd - this.spd / 2,
            Math.random() * this.spd - this.spd / 2,
            Math.random() * this.spd - this.spd / 2
        )
        this.sprite.userData.velocity.multiplyScalar(Math.random() * Math.random() * 1 + 2)
        this.sprite.material.color = this.color
        this.sprite.material.opacity = Math.random() * 1

        let size = Math.random() * 0.5 + 0.1
        this.sprite.scale.set(size, size, size)
        this.particleGroup.add(this.sprite)
        this.particleGroup.position.set(position.x, position.y, position.z)
        this.scene.add(this.particleGroup)
    }

    update() {
        this.particleGroup.children.forEach((child) => {
            child.position.add(child.userData.velocity)
            child.material.opacity -= 0.008
        })

        this.particleGroup.children = this.particleGroup.children.filter((child) => child.material.opacity > 0.0)
    }

    reset() {
        this.scene.remove(this.particleGroup)
    }

}