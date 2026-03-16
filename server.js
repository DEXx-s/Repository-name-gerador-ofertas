const express = require("express")
const puppeteer = require("puppeteer")

const app = express()

app.use(express.static("."))

app.get("/produto", async (req,res)=>{

try{

const url = req.query.url

const browser = await puppeteer.launch({
args:["--no-sandbox","--disable-setuid-sandbox"]
})

const page = await browser.newPage()

await page.goto(url,{waitUntil:"domcontentloaded"})

const titulo = await page.title()

await browser.close()

res.json({
titulo
})

}catch(e){

res.json({
titulo:"Produto Shopee"
})

}

})

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
console.log("Servidor rodando")
})