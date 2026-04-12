const table = document.getElementById("battingTable");

battingData.forEach(p=>{
let row = `<tr><td>${p.player}</td><td>${p.runs}</td></tr>`;
table.innerHTML += row;
});