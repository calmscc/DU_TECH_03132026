export function crawlAI(prompt,responses){

 const randomIndex =
 Math.floor(Math.random()*responses.length)

 return responses[randomIndex]

}
