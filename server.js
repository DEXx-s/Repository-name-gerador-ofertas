const express = require("express")
const puppeteer = require("puppeteer")

const app = express()

app.use(express.static("public"))

app.get("/produto", async (req,res)=>{

const url = req.query.url

try{

const browser = await puppeteer.launch({
args:["--no-sandbox"]
})

const page = await browser.newPage()

await page.goto(url,{waitUntil:"domcontentloaded"})

await page.waitForTimeout(4000)

const data = await page.evaluate(()=>{

let titulo = document.querySelector("title")?.innerText || ""

let preco = document.body.innerText.match(/R\$ ?[0-9]+[,\.][0-9]+/)

let imagem = document.querySelector("img")?.src || ""

return{
titulo,
preco:preco ? preco[0] : "",
imagem
}

})

await browser.close()

res.json(data)

}catch(e){

res.json({
titulo:"Produto Shopee",
preco:"",
imagem:""
})

}

})

app.listen(3000,()=>{
console.log("Servidor rodando")
})