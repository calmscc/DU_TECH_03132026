import cron from "node-cron"

export function startScheduler(runAudit){

 cron.schedule("0 * * * *",()=>{

  console.log("Running scheduled audit")

  runAudit()

 })

}
