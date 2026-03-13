import express from "express";
import cors from "cors";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(cors());
app.use(express.json());

/*
=====================================================
RETAIL STORES WE TRACK
=====================================================
*/

const retailStores = [
 "Amazon",
 "Walmart",
 "Target",
 "Best Buy",
 "Costco",
 "Home Depot",
 "Lowe's",
 "Apple",
 "Samsung"
];

/*
=====================================================
PATH SETUP
=====================================================
*/

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
=====================================================
SERVE FRONTEND
=====================================================
*/

app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
 res.sendFile(path.join(__dirname, "../frontend/dashboard.html"));
});

/*
=====================================================
GENERATED PRODUCT DATABASE
=====================================================
*/

function generateProducts(){

 const categories = {

  tools:[
   {brand:"Estwing", product:"Framing Hammer"},
   {brand:"Stanley", product:"Claw Hammer"},
   {brand:"DeWalt", product:"Steel Hammer"},
   {brand:"Milwaukee", product:"Construction Hammer"}
  ],

  electronics:[
   {brand:"Apple", product:"iPhone 15"},
   {brand:"Samsung", product:"Galaxy S24"},
   {brand:"Sony", product:"WH-1000XM5 Headphones"},
   {brand:"Dell", product:"XPS 13 Laptop"}
  ],

  appliances:[
   {brand:"Dyson", product:"V15 Vacuum"},
   {brand:"Ninja", product:"Air Fryer"},
   {brand:"Instant Pot", product:"Pressure Cooker"}
  ],

  sports:[
   {brand:"Nike", product:"Air Zoom Pegasus"},
   {brand:"Adidas", product:"Ultraboost"},
   {brand:"Wilson", product:"Pro Staff Tennis Racket"}
  ]

 }

 const stores = [
  "Amazon",
  "Walmart",
  "Target",
  "Best Buy",
  "Home Depot",
  "Lowe's"
 ]

 let id = 1
 const products = []

 for(const category in categories){

  categories[category].forEach(p=>{

   products.push({

    id:id++,

    name:`${p.brand} ${p.product}`,

    brand:p.brand,

    category:category,

    store:stores[Math.floor(Math.random()*stores.length)],

    price:Math.floor(Math.random()*900)+50,

    rating:(Math.random()*2+3).toFixed(1),

    description:`${p.brand} ${p.product} designed for professional and consumer use`

   })

  })

 }

 return products
}

const products = generateProducts()

/*
=====================================================
PROMPT HARVESTER
(Google + Reddit + templates)
=====================================================
*/

async function harvestPrompts(product){

 const prompts = []

 /* GOOGLE AUTOCOMPLETE */

 try{

  const googleURL =
  `https://suggestqueries.google.com/complete/search?client=firefox&q=${product}`

  const googleRes = await axios.get(googleURL)

  const suggestions = googleRes.data[1]

  suggestions.forEach(s=>{
   prompts.push(s)
  })

 }catch(e){
  console.log("Google suggestions failed")
 }

 /* REDDIT QUESTIONS */

 try{

  const redditURL =
  `https://www.reddit.com/search.json?q=${product}&limit=20`

  const redditRes = await axios.get(redditURL)

  const posts = redditRes.data.data.children

  posts.forEach(post=>{
   prompts.push(post.data.title)
  })

 }catch(e){
  console.log("Reddit prompts failed")
 }

 /* SHOPPING PROMPT TEMPLATES */

 const templates = [

  `best ${product}`,
  `top rated ${product}`,
  `best ${product} brands`,
  `best ${product} under 100`,
  `best ${product} under 200`,
  `where to buy ${product}`,
  `best place to buy ${product}`,
  `best ${product} deals`,
  `what store sells ${product}`,
  `best ${product} online`,
  `what ${product} do professionals recommend`,
  `cheap ${product} vs expensive`,
  `best ${product} reddit`,
  `best ${product} for beginners`,
  `best ${product} for professionals`

 ]

 templates.forEach(t=>{
  prompts.push(t)
 })

 return [...new Set(prompts)]

}

/*
=====================================================
SIMULATED AI QUERY
=====================================================
*/

async function queryAI(prompt){

 try{

  const url =
  `https://api.duckduckgo.com/?q=${prompt}&format=json`

  const res = await axios.get(url)

  return (
   res.data.AbstractText ||
   res.data.RelatedTopics?.map(t=>t.Text).join(" ") ||
   ""
  )

 }catch{

  return ""

 }

}

/*
=====================================================
AUDIT ENDPOINT
=====================================================
*/

app.post("/api/audit", async (req,res)=>{

 const { product } = req.body

 const prompts = await harvestPrompts(product)

 const storeCounts = {}

 retailStores.forEach(store=>{
  storeCounts[store] = 0
 })

 for(const prompt of prompts){

  const response = await queryAI(prompt)

  for(const store of retailStores){

   if(response.toLowerCase().includes(store.toLowerCase())){
    storeCounts[store]++
   }

  }

 }

 const rankings = Object.entries(storeCounts)
  .sort((a,b)=> b[1] - a[1])
  .map(([store,mentions])=>({store,mentions}))

 res.json({
  product,
  promptsTested: prompts.length,
  rankings
 })

})

/*
=====================================================
PRODUCT APIs
=====================================================
*/

app.get("/api/products",(req,res)=>{
 res.json(products)
})

app.get("/api/products/category/:category",(req,res)=>{

 const category = req.params.category

 const filtered = products.filter(
  p => p.category === category
 )

 res.json(filtered)

})

/*
=====================================================
SERVER
=====================================================
*/

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
 console.log(`Server running on port ${PORT}`)
})
