const express = require("express")
const puppeteer = require("puppeteer")

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static(__dirname))

app.get("/oferta", async (req,res)=>{

const url = req.query.url

try{

const browser = await puppeteer.launch({
args: ['--no-sandbox','--disable-setuid-sandbox']
})

const page = await browser.newPage()

await page.goto(url,{waitUntil:"domcontentloaded"})

await page.waitForTimeout(4000)

const data = await page.evaluate(()=>{

const title =
document.querySelector("meta[property='og:title']")?.content ||
document.title ||
"Produto Shopee"

const image =
document.querySelector("meta[property='og:image']")?.content || ""

let price = ""

const priceElement =
document.querySelector("[class*='price']") ||
document.querySelector("[class*='Price']")

if(priceElement){
price = priceElement.innerText
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
title:"Produto Shopee",
price:"",
image:""
})

}

})

app.listen(PORT,()=>{
console.log("Servidor rodando")
})