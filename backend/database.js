const audits = []

export function saveAudit(data){

 audits.push(data)

}

export function getAudits(){

 return audits

}
