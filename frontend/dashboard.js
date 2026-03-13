async function run(){

try{

// Get user inputs
let product = document.getElementById("product").value
let brand = document.getElementById("brand").value

// Basic validation
if(!product || !brand){
alert("Please enter both a product and brand")
return
}

// Show loading message
document.getElementById("visibility").innerText = "Analyzing..."
document.getElementById("accuracy").innerText = "Analyzing..."
document.getElementById("responses").innerHTML = "<p>Running AI queries...</p>"

// Call backend API
let res = await fetch(`/analyze?product=${encodeURIComponent(product)}&brand=${encodeURIComponent(brand)}`)

let data = await res.json()

console.log("API DATA:", data)

// Update visibility score
if(data.visibility !== undefined){
document.getElementById("visibility").innerText =
data.visibility + "%"
}

// Update accuracy score
if(data.accuracy !== undefined){
document.getElementById("accuracy").innerText =
data.accuracy + "%"
}

// Show AI responses
let html = "<h2>AI Responses</h2>"

for(let prompt in data.responses){

html += `
<div class="response-block">
<h4>${prompt}</h4>
<p>${data.responses[prompt]}</p>
</div>
`

}

document.getElementById("responses").innerHTML = html


// Show competitor mentions if available
if(data.competitors){

let competitorHTML = "<h2>Competitor Mentions</h2><ul>"

for(let c in data.competitors){

competitorHTML += `<li>${c}: ${data.competitors[c]}</li>`

}

competitorHTML += "</ul>"

document.getElementById("responses").innerHTML += competitorHTML

}

}catch(error){

console.error("Dashboard error:", error)

document.getElementById("responses").innerHTML =
"<p style='color:red;'>Error running analysis.</p>"

}

}
