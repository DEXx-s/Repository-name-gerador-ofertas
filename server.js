const express = require("express")
const axios = require("axios")
const cheerio = require("cheerio")
const path = require("path")

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static(__dirname))

app.get("/", (req,res)=>{
res.sendFile(path.join(__dirname,"index.html"))
})

app.get("/oferta", async (req,res)=>{

const url = req.query.url

try{

const response = await axios.get(url,{
headers:{
"user-agent":"Mozilla/5.0"
},
maxRedirects:5
})

const html = response.data

const $ = cheerio.load(html)

let nome =
$('meta[property="og:title"]').attr("content") ||
$("title").text()

let imagem =
$('meta[property="og:image"]').attr("content")

let precoAtual =
$(".pdp-price").first().text()

let precoOriginal =
$(".pdp-price-line").first().text()

if(!precoAtual){
precoAtual = "Ver preço no link"
}

let desconto = ""

if(precoOriginal && precoAtual){

let p1 = parseFloat(precoOriginal.replace(/[^\d]/g,""))
let p2 = parseFloat(precoAtual.replace(/[^\d]/g,""))

if(p1 && p2){
let off = Math.round((1 - p2/p1) * 100)
desconto = off + "% OFF"
}

}

const linkLimpo = url.split("?")[0]

const texto = `🔥 SUPER OFERTA SHOPEE

${nome}

💰 De: ${precoOriginal || "-"}
💸 Por: ${precoAtual}

🔥 ${desconto}

🛒 Comprar agora 👇
${linkLimpo}

⚡ Promoções mudam rápido`

res.json({
nome,
imagem,
precoAtual,
precoOriginal,
desconto,
texto,
link:linkLimpo
})

}catch(err){

res.json({erro:"Erro ao gerar oferta"})

}

})

app.listen(PORT, ()=>{
console.log("Servidor rodando 🚀")
})