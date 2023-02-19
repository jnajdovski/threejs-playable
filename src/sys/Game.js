import {
    MapControls
} from "three/examples/jsm/controls/OrbitControls";
import Player from "../objects/PlayerObject";
import Ground from "../objects/GroundObject";
import Lights from "../objects/Lights";
import BallObject from "../objects/BallObject";
import {
    getBallXPosition,
    isGood
} from "../utils/utils";
import Pool, {
    PoolObject
} from "./Pool";


export default class Game {

    constructor() {
        this.minBallXPos = -3
        this.maxBallXPos = 3
        this.ballYPos = 0.5
        this.startZPos = -6
        this.ballZPosOffset = 1


        this.container = document.querySelector('#main');
        document.body.appendChild(this.container);

        this.clock = new THREE.Clock(true)
        this.creteRenderer()

        this.ballsArray = []
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 35);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x999999);

        this.lights = new Lights(this.scene)
        const {
            directionalLight
        } = this.lights

        this.scene.fog = new THREE.Fog(0xffffff, 1, 70)

        //TODO: Remove at the end
        const grid = new THREE.GridHelper(50, 50, 0xffffff, 0x333333);
        this.scene.add(grid);

        this.groundObj = new Ground(this.scene)
        this.playerObj = new Player(this.scene)
        directionalLight.target = this.playerObj.player

        const mapControls = new MapControls(this.camera, this.renderer.domElement);
        mapControls.addEventListener('change', () => this.render());
        mapControls.update();

        this.camera.position.set(this.playerObj.player.position.x, this.playerObj.player.position.y + 2, this.playerObj.player.position.z + 3)

        ////////////////////////////////////////////////////////////
        // this.explosions = []
        ////////////////////////////////////////////////////////////
        // this.createBalls()
        this.pool = new Pool(() => this.createObjects(), (obj) => this.resetObject(obj), 100)

        this.ballsArray = this.pool.pool.map((obj) => {
            if (obj.data.type === 'good_ball' || obj.data.type === 'bad_ball') return obj
        })
        window.addEventListener('resize', () => this.onWindowResize(), false);
        this.onWindowResize();
        this.renderer.setAnimationLoop(() => this.render())
    }

    createObjects() {
        const ballPosition = new THREE.Vector3(getBallXPosition(this.maxBallXPos, this.minBallXPos), this.ballYPos, this.startZPos - this.ballZPosOffset)
        this.startZPos -= 1
        const ballObj = new BallObject(this.scene).create(isGood()).setPosition(ballPosition)
        return ballObj
    }

    /**
     * 
     * @param {PoolObject} obj 
     */
    resetObject(obj) {
        if (obj.data instanceof BallObject) {
            obj.data.hide()
        }
    }

    creteRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.VSMShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
        this.playerObj.updatePlayer(this.clock.getDelta())
        this.camera.position.set(this.playerObj.player.position.x, this.playerObj.player.position.y + 2, this.playerObj.player.position.z + 3)
        this.checkPlayerCollision()
        this.lights.directionalLight.position.set(this.playerObj.player.position.x + 5, this.playerObj.player.position.y + 10, this.playerObj.player.position.z);
        this.updateBalls()
    }

    updateBalls() {
        this.removeBalls()
        this.addBalls()
    }

    addBalls() {
        this.ballsArray.forEach((ballPoolObject) => {
            if (ballPoolObject.free &&
                !ballPoolObject.data.ball.showed &&
                ballPoolObject.data.ball.position.z < this.playerObj.player.position.z - 4 &&
                ballPoolObject.data.ball.position.z > this.playerObj.player.position.z - 15) {
                ballPoolObject.data.show()
            }
        })
    }

    removeBalls() {
        this.ballsArray.forEach((ballPoolObject) => {
            if (!ballPoolObject.free &&
                ballPoolObject.data.ball.position.z >
                this.playerObj.player.position.z) {
                this.pool.release(ballPoolObject)
            }
        })
    }

    checkPlayerCollision() {
        const {
            playerBB
        } = this.playerObj

        for (const ballObj of this.ballsArray) {
            if (playerBB.intersectsSphere(ballObj.data.ballBB)) {
                this.pool.release(ballObj)
            }
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.render();
    }
}