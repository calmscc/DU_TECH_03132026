async function run(){

let product = document.getElementById("product").value
let brand = document.getElementById("brand").value

let res = await fetch(`/analyze?product=${product}&brand=${brand}`)

let data = await res.json()

document.getElementById("visibility").innerText =
data.visibility + "%"

document.getElementById("accuracy").innerText =
data.accuracy + "%"


let labels = Object.keys(data.competitors)
let values = Object.values(data.competitors)

new Chart(document.getElementById("competitorChart"),{

type:"bar",

data:{
labels:labels,
datasets:[{
label:"Competitor Mentions",
data:values
}]
}

})


let heatLabels = Object.keys(data.heatmap)
let heatValues = Object.values(data.heatmap)

new Chart(document.getElementById("heatmapChart"),{

type:"bar",

data:{
labels:heatLabels,
datasets:[{
label:"AI Visibility",
data:heatValues
}]
}

})


let html=""

for(let p in data.responses){

html+=`<h3>${p}</h3><p>${data.responses[p]}</p>`

}

document.getElementById("responses").innerHTML = html

}
