async function run(){

try{

let product = document.getElementById("product").value.trim()
let brand = document.getElementById("brand").value.trim()

if(!product || !brand){
alert("Please enter both product and brand")
return
}

document.getElementById("results-section").style.display="block"

let res = await fetch(`/analyze?product=${encodeURIComponent(product)}&brand=${encodeURIComponent(brand)}`)

let data = await res.json()

console.log(data)


// --------------------
// EXECUTIVE SUMMARY
// --------------------

let summary = `
<h2>Executive Summary</h2>
<p><b>Product:</b> ${product}</p>
<p><b>Brand:</b> ${brand}</p>
<p><b>AI Visibility Score:</b> ${data.visibility}%</p>
<p><b>AI Accuracy Score:</b> ${Math.round(data.accuracy*100)}%</p>
`

document.getElementById("summary").innerHTML = summary



// --------------------
// COMPETITOR LEADERBOARD
// --------------------

let sorted = Object.entries(data.competitors)
.sort((a,b)=>b[1]-a[1])

let leaderboard="<ol>"

sorted.forEach(([name,count])=>{
leaderboard+=`<li>${name} — ${count} mentions</li>`
})

leaderboard+="</ol>"

document.getElementById("competitors").innerHTML=leaderboard



// --------------------
// KEY INSIGHT
// --------------------

let top = sorted[0]

let insight = `
<h2>Key Insight</h2>
<p>${top[0]} appears most frequently in AI shopping recommendations for <b>${product}</b>.</p>
`

document.getElementById("insight").innerHTML=insight



// --------------------
// AI QUERY RESULTS
// --------------------

let queryHTML=""

for(const [query,products] of Object.entries(data.platform_products)){

if(products.length>0){

queryHTML+=`
<div class="query-block">
<h4>${query}</h4>
<p><b>Retailers mentioned:</b> ${products.join(", ")}</p>
</div>
`

}

}

document.getElementById("queries").innerHTML=queryHTML



// --------------------
// FULL AI RESPONSES (COLLAPSIBLE)
// --------------------

let html=""

for(const [prompt,response] of Object.entries(data.responses)){

html+=`
<details>
<summary>${prompt}</summary>
<p>${response}</p>
</details>
`

}

document.getElementById("responses").innerHTML=html


}catch(error){

console.error(error)

document.getElementById("responses").innerHTML =
"<p style='color:red;'>Error running analysis.</p>"

}

}
