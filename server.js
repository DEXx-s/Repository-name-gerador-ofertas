const express = require("express")
const puppeteer = require("puppeteer")

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static(__dirname))

app.get("/oferta", async (req,res)=>{

const url = req.query.url

if(!url){
return res.json({erro:"URL não enviada"})
}

try{

const browser = await puppeteer.launch({
headless: "new",
args: [
"--no-sandbox",
"--disable-setuid-sandbox",
"--disable-dev-shm-usage",
"--disable-gpu"
]
})

const page = await browser.newPage()

await page.goto(url,{waitUntil:"networkidle2"})

await page.waitForTimeout(5000)

const data = await page.evaluate(()=>{

const title =
document.querySelector("meta[property='og:title']")?.content ||
document.title

const image =
document.querySelector("meta[property='og:image']")?.content || ""

let price = ""

const possible = document.body.innerText.match(/R\$ ?\d+,\d+/)

if(possible){
price = possible[0]
}

return{
title,
image,
price
}

})

await browser.close()

res.json(data)

}catch(err){

res.json({
title:"Erro ao ler produto",
price:"",
image:""
})

}

})

app.listen(PORT,()=>{
console.log("Servidor rodando")
})