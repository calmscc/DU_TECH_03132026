async function run(){

let product = document.getElementById("product").value
let brand = document.getElementById("brand").value

let res = await fetch(`/analyze?product=${product}&brand=${brand}`)

let data = await response.json()

console.log(data)

document.getElementById("visibility").innerText =
data.visibility + "%"

document.getElementById("accuracy").innerText =
data.accuracy + "%"

let html=""

for(let p in data.responses){

html+=`<h3>${p}</h3><p>${data.responses[p]}</p>`

}

document.getElementById("responses").innerHTML = html

}
