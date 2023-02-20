import {
    keyDown
} from "../utils/utils";

export default class PlayerObject {

    /**
     * 
     * @param {THREE.Scene} scene 
     */
    constructor(scene, camera, ground) {
        this.movementSpeed = 1.8
        this.rotateSpeed = 0.5
        this.moveLeft = false
        this.moveRight = false
        this.maxMoveLeft = -3.2
        this.maxMoveRight = 3.4
        this.startGame = false

        this.currentZpos = 0;

        this.camera = camera
        this.ground = ground

        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();
        this.ico;
        this.mousePressed = false;

        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([
            -1, 0, 0,
            -1, 0.5, 0,
            1, 0, 0,

            1, 0, 0,
            -1, 0.5, 0,
            1, 0.5, 0,

            -1, 0.5, 0,
            1, 0.5, 0,
            0, 0.5, -2,

            -1, 0, 0,
            1, 0, 0,
            0, 0, -2,

            -1, 0, 0,
            -1, 0.5, 0,
            0, 0, -2,

            -1, 0.5, 0,
            0, 0.5, -2,
            0, 0, -2,

            1, 0, 0,
            1, 0.5, 0,
            0, 0, -2,

            1, 0.5, 0,
            0, 0.5, -2,
            0, 0, -2

        ]);

        let colors = []
        for (let i = 0; i < vertices.length / 3; i++) {
            colors.push(0, 250, 112)
        }

        geometry.setAttribute('color', new THREE.BufferAttribute(new Uint8Array(colors), 3, true));
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.computeVertexNormals()

        const material = new THREE.MeshStandardMaterial({
            vertexColors: true,
            side: THREE.DoubleSide,
        });

        this.player = new THREE.Mesh(geometry, material);
        this.player.position.setY(0.2)
        this.player.castShadow = true;
        this.player.receiveShadow = true;
        this.player.scale.set(0.8, 0.8, 0.8)

        this.playerBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
        this.playerBB.setFromObject(this.player)
        scene.add(this.player);

        window.addEventListener('keydown', (event) => {
            if (keyDown(event) === 'left') this.moveLeft = true
            if (keyDown(event) === 'right') this.moveRight = true
        });

        window.addEventListener('keyup', (event) => {
            if (keyDown(event) === 'left') this.moveLeft = false
            if (keyDown(event) === 'right') this.moveRight = false
        });

        window.addEventListener('pointermove', (e) => {
            if (this.mousePressed) {
                this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
                this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
            }
        }, false);

        window.addEventListener('pointerdown', () => {
            this.mousePressed = true
            this.startGame = true
        }, false);
        window.addEventListener('pointerup', () => this.mousePressed = false, false);
    }

    canMoveLeft() {
        return this.player.position.x > this.maxMoveLeft
    }

    canMoveRight() {
        return this.player.position.x < this.maxMoveRight
    }

    /**
     * 
     * @param {string} type 
     */
    changePlayerColor(type) {
        const x = type === 'bad_ball' ? 1 : 0;
        const y = type === 'bad_ball' ? 0 : 1;
        const z = 0;
        this.player.material.vertexColors = true;
        const geometry = this.player.geometry;
        const count = geometry.attributes.position.count;
        if (!geometry.attributes.color) {
            const buffer = new THREE.BufferAttribute(new Float32Array(count * 3), 3)
            geometry.setAttribute('color', buffer);
        };
        for (let i = 0; i < count; i++) geometry.attributes.color.setXYZ(i, x, y, z);
        geometry.attributes.color.needsUpdate = true;
    }

    /**
     * 
     * @param {number} delta 
     */
    update(delta) {
        if (this.startGame) {
            const actualMoveSpeed = delta * this.movementSpeed;
            this.currentZpos -= 0.05
            if (!this.mousePressed) {
                this.player.position.z -= 0.05
            }
            if (this.moveRight && this.canMoveRight()) this.player.translateX(actualMoveSpeed)
            if (this.moveLeft && this.canMoveLeft()) this.player.translateX(-actualMoveSpeed)


            if (this.mousePressed) {
                this.raycaster.setFromCamera(this.pointer, this.camera);
                const intersects = this.raycaster.intersectObjects([this.ground]);
                if (intersects.length) {
                    const {
                        point
                    } = intersects[0];
                    this.player.position.set(point.x / 1.5, 0.2, this.currentZpos)
                }
            }

            this.playerBB.copy(this.player.geometry.boundingBox).applyMatrix4(this.player.matrixWorld)
        }
    }
}