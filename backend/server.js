import express from "express"
import cors from "cors"
import axios from "axios"
import path from "path"
import { fileURLToPath } from "url"

const app = express()

app.use(cors())
app.use(express.json())

/*
========================================
AI ENGINES (SIMULATED)
========================================
*/

const aiEngines = [
 "chatgpt",
 "gemini",
 "perplexity"
]

/*
========================================
PATH SETUP
========================================
*/

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(path.join(__dirname,"../frontend")))

app.get("/",(req,res)=>{
 res.sendFile(path.join(__dirname,"../frontend/dashboard.html"))
})

/*
========================================
PROMPT GENERATOR
========================================
*/

async function harvestPrompts(product){

 const prompts = []

 const templates = [

  `best ${product}`,
  `top rated ${product}`,
  `best ${product} brands`,
  `best ${product} under 200`,
  `where to buy ${product}`,
  `best place to buy ${product}`,
  `best ${product} deals`,
  `what store sells ${product}`,
  `best ${product} online`,
  `best ${product} reddit`

 ]

 templates.forEach(t=>prompts.push(t))

 return prompts
}

/*
========================================
SEARCH HTML SOURCE — DUCKDUCKGO
========================================
*/

async function searchDuckHTML(prompt){

 try{

  const url =
  `https://html.duckduckgo.com/html/?q=${encodeURIComponent(prompt)}`

  const res = await axios.get(url,{
   timeout:15000,
   headers:{
    "User-Agent":"Mozilla/5.0"
   }
  })

  return res.data

 }catch(err){

  console.log("DuckDuckGo HTML failed:",prompt)

  return ""

 }

}

/*
========================================
SEARCH HTML SOURCE — BING
========================================
*/

async function searchBingHTML(prompt){

 try{

  const url =
  `https://www.bing.com/search?q=${encodeURIComponent(prompt)}`

  const res = await axios.get(url,{
   timeout:15000,
   headers:{
    "User-Agent":"Mozilla/5.0"
   }
  })

  return res.data

 }catch(err){

  console.log("Bing HTML failed:",prompt)

  return ""

 }

}

/*
========================================
MULTI-SOURCE SEARCH
========================================
*/

async function querySearch(prompt){

 const sources = [

  searchDuckHTML,
  searchBingHTML

 ]

 for(const source of sources){

  const html = await source(prompt)

  if(html && html.length > 0){
   return html
  }

 }

 return ""
}

/*
========================================
AI VISIBILITY AUDIT
========================================
*/

app.post("/api/audit", async (req,res)=>{

 const { store, product } = req.body

 console.log("Starting audit:",store,product)

 const prompts = await harvestPrompts(product)

 const mentions = {}

 aiEngines.forEach(engine=>{
  mentions[engine] = 0
 })

 for(const prompt of prompts){

  console.log("Testing prompt:",prompt)

  const html = await querySearch(prompt)

  for(const engine of aiEngines){

   if(html.toLowerCase().includes(store.toLowerCase())){
    mentions[engine]++
   }

  }

 }

 const visibility = {}

 aiEngines.forEach(engine=>{

  visibility[engine] =
   Math.round((mentions[engine] / prompts.length) * 100)

 })

 console.log("Audit finished")

 res.json({

  store,
  product,
  promptsTested:prompts.length,
  mentions,
  visibility

 })

})

/*
========================================
SERVER START
========================================
*/

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
 console.log(`Server running on port ${PORT}`)
})
