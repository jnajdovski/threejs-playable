import Player from "../objects/PlayerObject";
import Ground from "../objects/GroundObject";
import Lights from "../objects/Lights";
import BallObject from "../objects/BallObject";
import {
    getBallXPosition,
    getRandNum,
    isGood
} from "../utils/utils";
import Pool, {
    PoolObject
} from "./Pool";
import Particles from "../objects/Particles";


export default class Game {
    constructor() {
        this.minBallXPos = -3
        this.maxBallXPos = 3
        this.ballYPos = 0.5
        this.startZPos = -6
        this.ballZPosOffset = 1
        this.score = 0
        this.ballsNum = 0
        this.maxNumOfBalls = 15
        this.gameFinished = false
        this.timeOutStarted = false

        this.container = document.querySelector('#main');
        document.body.appendChild(this.container);

        this.scene = new THREE.Scene();
        const loader = new THREE.TextureLoader();
        this.scene.background = loader.load('assets/background.jpg')

        this.clock = new THREE.Clock(true)
        this.creteRenderer()

        this.ballsArray = []
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.5, 35);

        this.lights = new Lights(this.scene)
        const {
            directionalLight
        } = this.lights

        this.scene.fog = new THREE.Fog(0xffffff, 4, 35)

        this.groundObj = new Ground(this.scene)
        this.playerObj = new Player(this.scene, this.camera, this.groundObj.ground)
        directionalLight.target = this.playerObj.player

        this.ballsPool = new Pool(() => this.createBallObjects(), (obj) => this.resetBallObject(obj), 100)
        this.particlePool = new Pool(() => this.createParticleObjects(), (obj) => this.resetParticleObjects(obj), 100)

        window.addEventListener('resize', () => this.onWindowResize(), false);
        this.onWindowResize();
        this.renderer.setAnimationLoop(() => this.update())
    }

    showButton() {
        this.gameFinished = true
        this.playerObj.startGame = false
        const button = document.getElementById("play-btn")
        button.style.visibility = 'visible'

        const canvas = document.getElementById('second')
        this.img = document.createElement("img");
        this.img.src = 'assets/transparent.png';
        this.img.width = window.innerWidth;
        this.img.height = window.innerHeight;
        canvas.appendChild(this.img)
        canvas.style.visibility = 'visible'
        button.onclick = () => {
            window.location.assign('https://threejs.org/')
        }
    }

    createParticleObjects() {
        const particles = new Particles(this.scene)
        particles.makeParticles()
        return particles
    }

    resetParticleObjects(obj) {
        obj.data.reset()
    }

    createBallObjects() {
        const ballPosition = new THREE.Vector3(0, 0, 0)
        return new BallObject(this.scene).create(isGood()).setPosition(ballPosition)
    }

    /**
     * 
     * @param {PoolObject} obj 
     */
    resetBallObject(obj) {
        obj.data.hide()
        if (this.ballsNum > 0)
            this.ballsNum--
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

    update() {
        if (!this.gameFinished) {
            this.playerObj.update(this.clock.getDelta())
            this.camera.position.set(this.playerObj.player.position.x, this.playerObj.player.position.y + 2, this.playerObj.player.position.z + 3)
            this.checkPlayerCollision()
            this.lights.directionalLight.position.set(this.playerObj.player.position.x + 5, this.playerObj.player.position.y + 10, this.playerObj.player.position.z);
            this.updateBalls()

            if (this.particlePool.pool.length > 0) {
                this.particlePool.pool.forEach((exp) => {
                    if (!exp.free) {
                        exp.data.update()
                    }
                })
            }

            if (!this.timeOutStarted && this.playerObj.startGame) {
                this.timeOutStarted = true
                setTimeout(() => {
                    this.showButton()
                }, 10000);
            }
        }
        this.renderer.autoClear = false
        this.renderer.clear()
        this.renderer.render(this.scene, this.camera);
    }

    updateBalls() {
        this.removeBall()
        this.addBall()
    }

    addBall() {
        if (this.ballsNum < this.maxNumOfBalls) {
            const newBall = this.ballsPool.getFree()
            newBall.data.ball.position.set(getBallXPosition(this.maxBallXPos, this.minBallXPos), this.ballYPos, getRandNum(this.playerObj.player.position.z - 10, this.playerObj.player.position.z - 15))
            newBall.data.show()
            this.ballsArray.push(newBall)
            this.ballsNum++
        }

    }

    removeBall() {
        this.ballsArray.forEach((ballPoolObject) => {
            if (!ballPoolObject.free &&
                ballPoolObject.data.ball.position.z >
                this.playerObj.player.position.z) {
                this.ballsPool.release(ballPoolObject)
            }
        })
    }

    /**
     * 
     * @param {string} ballType 
     */
    updateScore(ballType) {
        if (ballType === 'good_ball') this.score++
        else this.score--

        const scoreEl = document.getElementById('score')
        scoreEl.textContent = `Score: ${this.score}`
    }

    checkPlayerCollision() {
        const {
            playerBB,
        } = this.playerObj
        for (const ballObj of this.ballsArray) {
            if (!ballObj.free && playerBB.intersectsSphere(ballObj.data.ballBB)) {
                this.explode(ballObj.data.ball.position)
                this.updateScore(ballObj.data.type)
                this.ballsPool.release(ballObj)
                this.playerObj.changePlayerColor(ballObj.data.type)
            }
        }
    }

    /**
     * 
     * @param {THREE.Vector3} position 
     */
    explode(position) {
        const particle = this.particlePool.getFree()
        particle.data.explode(position)
        setTimeout(() => {
            this.particlePool.release(particle)
        }, 1000);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        if (this.img) {
            this.img.width = window.innerWidth;
            this.img.height = window.innerHeight;
        }
        this.update();
    }
}