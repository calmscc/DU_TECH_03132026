<!DOCTYPE html>
<html>

<head>

<title>NOLAlytics AI Retail Visibility Analyzer</title>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<style>

body{
 font-family:Arial;
 max-width:1000px;
 margin:auto;
 padding:40px;
 background:#f5f7fb;
}

h1{
 margin-bottom:20px;
}

input{
 padding:10px;
 margin-right:10px;
}

button{
 padding:10px 15px;
 cursor:pointer;
}

.cards{
 display:flex;
 gap:20px;
 margin-top:20px;
}

.card{
 flex:1;
 background:white;
 padding:20px;
 border-radius:10px;
 box-shadow:0 2px 8px rgba(0,0,0,0.1);
 text-align:center;
}

.card h2{
 margin:0;
 font-size:28px;
}

#results{
 margin-top:20px;
 background:white;
 padding:20px;
 border-radius:10px;
 box-shadow:0 2px 8px rgba(0,0,0,0.1);
}

canvas{
 margin-top:30px;
 background:white;
 padding:20px;
 border-radius:10px;
 box-shadow:0 2px 8px rgba(0,0,0,0.1);
}

</style>

</head>

<body>

<h1>NOLAlytics AI Retail Visibility Analyzer</h1>

<input id="storeInput" placeholder="Retail Store (example: Walmart)" />

<input id="productInput" placeholder="Product (example: headphones)" />

<button onclick="runAudit()">Analyze Visibility</button>

<div class="cards">

<div class="card">
<h3>Prompts Tested</h3>
<h2 id="promptsCard">0</h2>
</div>

<div class="card">
<h3>Best Performing AI</h3>
<h2 id="bestEngine">-</h2>
</div>

<div class="card">
<h3>Highest Visibility</h3>
<h2 id="topScore">0%</h2>
</div>

</div>

<div id="results"></div>

<h3>AI Visibility Leaderboard</h3>

<canvas id="visibilityChart"></canvas>

<script>

let chart

async function runAudit(){

 const store =
 document.getElementById("storeInput").value

 const product =
 document.getElementById("productInput").value

 document.getElementById("results").innerHTML =
 "Running AI visibility audit..."

 const res = await fetch("/api/audit",{

  method:"POST",

  headers:{
   "Content-Type":"application/json"
  },

  body:JSON.stringify({ store, product })

 })

 const data = await res.json()

 if(data.error){

  document.getElementById("results").innerHTML =
  data.error

  return

 }

 const engines =
 Object.keys(data.visibility)

 const scores =
 Object.values(data.visibility)

 let bestEngine = engines[0]
 let bestScore = scores[0]

 engines.forEach((e,i)=>{
  if(scores[i] > bestScore){
   bestScore = scores[i]
   bestEngine = e
  }
 })

 document.getElementById("promptsCard").innerText =
 data.promptsTested

 document.getElementById("bestEngine").innerText =
 bestEngine.toUpperCase()

 document.getElementById("topScore").innerText =
 bestScore + "%"

 let html = `
 <h3>AI Visibility Results</h3>
 Store: <b>${data.store}</b><br>
 Product: <b>${data.product}</b><br><br>
 `

 engines.forEach(engine=>{

  html += `
  <b>${engine.toUpperCase()}</b><br>
  Mentions: ${data.mentions[engine]}<br>
  Visibility Score: ${data.visibility[engine]}%<br><br>
  `

 })

 document.getElementById("results").innerHTML = html

 renderChart(data.visibility)

}

function renderChart(visibility){

 const labels =
 Object.keys(visibility)

 const values =
 Object.values(visibility)

 const ctx =
 document.getElementById("visibilityChart").getContext("2d")

 if(chart){
  chart.destroy()
 }

 chart = new Chart(ctx,{

  type:"bar",

  data:{
   labels:labels,
   datasets:[{
    label:"Visibility Score %",
    data:values,
    borderWidth:1
   }]
  },

  options:{
   scales:{
    y:{
     beginAtZero:true,
     max:100
    }
   }
  }

 })

}

</script>

</body>

</html>
