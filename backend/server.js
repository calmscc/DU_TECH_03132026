import express from "express"
import cors from "cors"
import { exec } from "child_process"
import { generatePrompts } from "./promptGenerator.js"
import { saveAudit } from "./database.js"

const app = express()

app.use(cors())
app.use(express.json())

app.post("/api/audit",(req,res)=>{

 const { store, product } = req.body

 const prompts = generatePrompts(product)

 exec(
  `python3 main.py "${store}" "${product}"`,
  (error,stdout,stderr)=>{

   if(error){
    console.log(error)
    return res.json({error:"Python engine failed"})
   }

   const result = JSON.parse(stdout)

   saveAudit(result)

   res.json(result)

  }
 )

})

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
 console.log("Server running on port",PORT)
})
