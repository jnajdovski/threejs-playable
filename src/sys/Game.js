import {
    MapControls
} from "three/examples/jsm/controls/OrbitControls";
import Player from "../objects/PlayerObject";
import Ground from "../objects/GroundObject";
import Lights from "../objects/Lights";

export default class Game {

    constructor() {
        this.container = document.querySelector('#main');
        document.body.appendChild(this.container);

        this.clock = new THREE.Clock(true)
        this.creteRenderer()

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x999999);

        this.lights = new Lights(this.scene)
        const {
            directionalLight
        } = this.lights

        //TODO: Remove at the end
        const grid = new THREE.GridHelper(50, 50, 0xffffff, 0x333333);
        this.scene.add(grid);

        this.groundObj = new Ground(this.scene)
        this.playerObj = new Player(this.scene)
        directionalLight.target = this.playerObj.player

        const mapControls = new MapControls(this.camera, this.renderer.domElement);
        mapControls.addEventListener('change', () => this.render());
        mapControls.update();

        window.addEventListener('resize', () => this.onWindowResize(), false);
        this.onWindowResize();
        this.renderer.setAnimationLoop(() => this.render())
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
        this.camera.position.set(this.playerObj.player.position.x, this.playerObj.player.position.y + 1, this.playerObj.player.position.z + 3)
        this.lights.directionalLight.position.set(this.playerObj.player.position.x - 5, this.playerObj.player.position.y + 25, this.playerObj.player.position.z - 1);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.render();
    }
}