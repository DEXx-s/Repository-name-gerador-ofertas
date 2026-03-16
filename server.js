const express = require("express")
const puppeteer = require("puppeteer")

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static(__dirname))

app.get("/oferta", async (req,res)=>{

const url = req.query.url

try{

const browser = await puppeteer.launch({
headless:true,
args:[
"--no-sandbox",
"--disable-setuid-sandbox",
"--disable-dev-shm-usage",
"--disable-gpu"
]
})

const page = await browser.newPage()

await page.goto(url,{waitUntil:"domcontentloaded"})

await page.waitForTimeout(6000)

const data = await page.evaluate(()=>{

const title =
document.querySelector("meta[property='og:title']")?.content ||
document.title

const image =
document.querySelector("meta[property='og:image']")?.content || ""

let price = ""

const prices = document.body.innerText.match(/R\$ ?\d+,\d+/g)

if(prices){
price = prices[0]
}

return{
title,
image,
price
}

})

await browser.close()

res.json(data)

}catch(e){

res.json({
title:"Erro ao pegar produto",
price:"",
image:""
})

}

})

app.listen(PORT,()=>{
console.log("Servidor rodando")
})