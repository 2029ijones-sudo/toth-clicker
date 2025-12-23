// ========================
// GAME VARIABLES
// ========================
let TP = 0;
let baseClick = 1;
let autoTP = 0;
let multiplier = 1;
let floor = 1;

// ========================
// DISPLAY ELEMENTS
// ========================
const tpDisplay = document.getElementById("tp");
const floorDisplay = document.getElementById("floor");
const teethArea = document.getElementById("teeth-area");

// ========================
// THREE.JS SETUP
// ========================
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// LIGHTING
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// ========================
// LOAD PLAYER (npc_erica.obj)
// ========================
const objLoader = new OBJLoader();
objLoader.load('assets/npc_erica.obj', function(object){
    object.position.set(0, 0, 0);
    object.scale.set(0.5, 0.5, 0.5);
    scene.add(object);

    window.playerObject = object; // global reference
});

// ========================
// LOAD BOSS (boss.fbx)
// ========================
const fbxLoader = new FBXLoader();
fbxLoader.load('assets/boss.fbx', function(object){
    object.position.set(3, 0, -2);
    object.scale.set(0.01, 0.01, 0.01); // adjust as needed
    scene.add(object);

    window.bossObject = object; // global reference
});

camera.position.z = 5;

// ========================
// SPAWN TOOTH
// ========================
function spawnTooth(type = "normal") {
    const tooth = document.createElement("button");
    tooth.className = "tooth " + type;
    tooth.textContent = type.toUpperCase() + " Tooth";

    tooth.onclick = () => {
        let mult = 1;
        switch(type){
            case "normal": mult = 1; break;
            case "big": mult = 2; break;
            case "gold": mult = 5; break;
            case "rotten": mult = 0.5; break;
        }
        TP += baseClick * multiplier * mult;
        updateStats();
        tooth.remove();

        // Animate player 3D object
        if(window.playerObject){
            window.playerObject.rotation.y += 0.3; // simple click animation
        }
    };

    // Random position in teeth area
    tooth.style.position = "absolute";
    tooth.style.left = Math.random() * (teethArea.offsetWidth - 100) + "px";
    tooth.style.top = Math.random() * (teethArea.offsetHeight - 50) + "px";

    teethArea.appendChild(tooth);
}

// ========================
// UPDATE STATS DISPLAY
// ========================
function updateStats() {
    tpDisplay.textContent = "TP: " + Math.floor(TP);
    floorDisplay.textContent = "Floor: " + floor;
}

// ========================
// AUTO-CLICKER
// ========================
setInterval(() => {
    if(autoTP > 0){
        TP += autoTP;
        updateStats();
    }
}, 1000);

// ========================
// SPAWN TEETH PERIODICALLY
// ========================
setInterval(() => {
    const types = ["normal","big","gold","rotten"];
    spawnTooth(types[Math.floor(Math.random()*types.length)]);
}, 1000);

// ========================
// UPGRADE BUTTONS
// ========================
const upgrades = {
    "stronger-drill": { cost: 50, effect: () => { baseClick += 1; } },
    "faster-hands": { cost: 100, effect: () => { autoTP += 2; } },
    "whitening": { cost: 200, effect: () => { multiplier += 0.5; } },
    "xray": { cost: 300, effect: () => { for(let i=0;i<3;i++) spawnTooth("gold"); } },
    "assistant": { cost: 500, effect: () => { autoTP += 5; } },
    "new-floor": { cost: 1000, effect: () => { floor += 1; } }
};

for(const id in upgrades){
    const button = document.getElementById(id);
    button.onclick = () => {
        const upgrade = upgrades[id];
        if(TP >= upgrade.cost){
            TP -= upgrade.cost;
            upgrade.effect();
            updateStats();
        }
    };
}

// ========================
// ANIMATE SCENE
// ========================
function animate() {
    requestAnimationFrame(animate);

    // Optional: slowly rotate boss
    if(window.bossObject){
        window.bossObject.rotation.y += 0.01;
    }

    renderer.render(scene, camera);
}
animate();

// ========================
// INITIAL STATS UPDATE
// ========================
updateStats();
