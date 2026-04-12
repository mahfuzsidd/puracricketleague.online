const table = document.getElementById("battingTable");

battingData.forEach(p=>{
let row = `<tr><td>${p.player}</td><td>${p.runs}</td></tr>`;
table.innerHTML += row;
});
// 🔥 BATTING DATA
fetch("https://opensheet.elk.sh/1tUGjc1s7Qo8Zvn7jmn3PhUKmUk2hs7yF3OpZXXqiJSU/Batting")
.then(res => res.json())
.then(data => {

let topBatsman = data[0];
let superStriker = null;

data.forEach(player => {

let runs = Number(player.Runs || 0);
let sr = Number(player.SR || 0);
let balls = Number(player.Balls || 0);

// 🏏 TOP BATSMAN
if(runs > (Number(topBatsman.Runs) || 0)){
topBatsman = player;
}

// ⚡ SUPER STRIKER (min 10 balls)
if(balls >= 10){
if(!superStriker || sr > Number(superStriker.SR)){
superStriker = player;
}
}

});

document.getElementById("top-batsman").innerHTML =
`${topBatsman.Player} (${topBatsman.Runs} runs)`;

document.getElementById("super-striker").innerHTML =
`${superStriker.Player} (SR: ${superStriker.SR})`;

});


// 🔥 BOWLING DATA
fetch("https://opensheet.elk.sh/1tUGjc1s7Qo8Zvn7jmn3PhUKmUk2hs7yF3OpZXXqiJSU/Bowling")
.then(res => res.json())
.then(data => {

let topBowler = data[0];

data.forEach(player => {

let wkts = Number(player.Wickets || player.Wkts || 0);

if(wkts > (Number(topBowler.Wickets || topBowler.Wkts) || 0)){
topBowler = player;
}

});

document.getElementById("top-bowler").innerHTML =
`${topBowler.Player} (${topBowler.Wickets || topBowler.Wkts} wkts)`;

});if(!superStriker){
document.getElementById("super-striker").innerHTML = "Check Balls Column ❌";
}
// 💣 TOP 3 SIX HITTERS
fetch("https://opensheet.elk.sh/1tUGjc1s7Qo8Zvn7jmn3PhUKmUk2hs7yF3OpZXXqiJSU/Batting")
.then(res => res.json())
.then(data => {

let players = data.map(p => ({
name: p.Player,
sixes: Number(p["6s"] || p.sixes || 0)
}));

// 🔥 SORT DESC
players.sort((a,b) => b.sixes - a.sixes);

// 🔥 TOP 3
let top3 = players.slice(0,3);

let output = "";

top3.forEach((p,i)=>{
output += `<p>${i+1}. ${p.name} - ${p.sixes} sixes</p>`;
});

document.getElementById("top-sixes").innerHTML = output;

});     
// 1. डिस्क्रिप्शन को फॉर्मेट करने का नया और एडवांस तरीका
function formatDescription(text) {
    let formattedText = text;

    // हम प्लेयर लिस्ट को बड़े नाम से छोटे नाम के क्रम में सॉर्ट करते हैं ताकि 'Mahfuz Siddiqui' पहले मैच हो 'Mahfuz' से
    const sortedPlayers = [...allPlayerData].sort((a, b) => b.Player.length - a.Player.length);

    sortedPlayers.forEach(p => {
        const pName = p.Player.trim();
        // यह 'Exact Match' ढूंढेगा चाहे बीच में स्पेस हो
        // हमने @ को ऑप्शनल रखा है: @Mahfuz Siddiqui या सिर्फ Mahfuz Siddiqui दोनों काम करेंगे
        const regex = new RegExp(`@?(${pName})`, 'gi'); 
        
        formattedText = formattedText.replace(regex, (match) => {
            return `<span class="player-mention" onclick="openPlayerStats('${pName}')">${match}</span>`;
        });
    });

    return formattedText;
}

// 2. प्लेयर स्टैट्स खोलने का लॉजिक (Space friendly)
function openPlayerStats(playerName) {
    // Exact match ढूंढना
    const p = allPlayerData.find(player => 
        player.Player.trim().toLowerCase() === playerName.toLowerCase()
    );

    if (!p) {
        console.error("Player not found:", playerName);
        return;
    }

    // पॉपअप में डेटा भरना
    document.getElementById("mName").innerText = p.Player;
    document.getElementById("mRole").innerText = p.Role || "Player";
    document.getElementById("mImg").src = p.Image || 'https://via.placeholder.com/300?text=No+Photo';
    
    // स्टैट्स की लिस्ट
    const statsToShow = [
        {l: 'Mat', v: p.Mat}, {l: 'Runs', v: p.Runs}, {l: 'HS', v: p.HS}, 
        {l: 'Avg', v: p.Avg}, {l: 'SR', v: p.SR}, {l: '4s', v: p['4s']}, {l: '6s', v: p['6s']}
    ];
    
    let statHtml = "";
    statsToShow.forEach(s => {
        statHtml += `<div class="stat-row"><b>${s.l}</b> <span>${s.v || 0}</span></div>`;
    });
    
    document.getElementById("modalStatsList").innerHTML = statHtml;
    document.getElementById("statsModal").style.display = "block";
}