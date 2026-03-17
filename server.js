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

await page.goto(url,{waitUntil:"networkidle2"})

// espera redirecionar
await page.waitForTimeout(3000)

const data = await page.evaluate(()=>{

let titulo = document.querySelector('meta[property="og:title"]')?.content

let imagem = document.querySelector('meta[property="og:image"]')?.content

let preco = document.body.innerText.match(/R\$ ?\d+[,\.]\d+/)?.[0]

return{
titulo,
imagem,
preco
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

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
console.log("Servidor rodando")
})