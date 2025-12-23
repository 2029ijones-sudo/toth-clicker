let TP = 0;
let baseClick = 1;
let autoTP = 0;
let multiplier = 1;
let floor = 1;

// Display elements
const tpDisplay = document.getElementById("tp");
const floorDisplay = document.getElementById("floor");
const teethArea = document.getElementById("teeth-area");

// Spawn a tooth
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
    };
    tooth.style.position = "absolute";
    tooth.style.left = Math.random()*800 + "px";
    tooth.style.top = Math.random()*400 + "px";
    teethArea.appendChild(tooth);
}

// Update stats display
function updateStats() {
    tpDisplay.textContent = "TP: " + Math.floor(TP);
    floorDisplay.textContent = "Floor: " + floor;
}

// Auto-clicker
setInterval(() => {
    TP += autoTP;
    updateStats();
}, 1000);

// Spawn teeth every second
setInterval(() => {
    spawnTooth(["normal","big","gold","rotten"][Math.floor(Math.random()*4)]);
}, 1000);

// Upgrade buttons
document.getElementById("stronger-drill").onclick = () => {
    if(TP>=50){ TP-=50; baseClick+=1; updateStats(); }
};
document.getElementById("faster-hands").onclick = () => {
    if(TP>=100){ TP-=100; autoTP+=2; updateStats(); }
};
document.getElementById("whitening").onclick = () => {
    if(TP>=200){ TP-=200; multiplier+=0.5; updateStats(); }
};
document.getElementById("xray").onclick = () => {
    if(TP>=300){ TP-=300; for(let i=0;i<3;i++) spawnTooth("gold"); updateStats(); }
};
document.getElementById("assistant").onclick = () => {
    if(TP>=500){ TP-=500; autoTP+=5; updateStats(); }
};
document.getElementById("new-floor").onclick = () => {
    if(TP>=1000){ TP-=1000; floor+=1; updateStats(); }
};
