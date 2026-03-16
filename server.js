const express = require("express")
const puppeteer = require("puppeteer-core")
const chromium = require("@sparticuz/chromium")

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static(__dirname))

app.get("/oferta", async (req,res)=>{

const url = req.query.url

try{

const browser = await puppeteer.launch({
args: chromium.args,
defaultViewport: chromium.defaultViewport,
executablePath: await chromium.executablePath(),
headless: chromium.headless
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

const match = document.body.innerText.match(/R\$ ?\d+,\d+/)

if(match){
price = match[0]
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

app.listen(PORT,()=>console.log("Servidor rodando"))