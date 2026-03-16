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
maxRedirects:5,
headers:{
"User-Agent":"Mozilla/5.0"
}
})

const html = response.data

const $ = cheerio.load(html)

const nome =
$('meta[property="og:title"]').attr("content") ||
$("title").text()

const imagem =
$('meta[property="og:image"]').attr("content")

// detectar preços
let precoAtual =
$(".pdp-price").text() ||
$('[class*="price"]').first().text()

let precoOriginal =
$('[class*="original"]').first().text()

function limpar(p){

if(!p) return null

return parseFloat(
p.replace("R$","")
.replace(/\./g,"")
.replace(",",".")
.trim()
)

}

const atual = limpar(precoAtual)
const original = limpar(precoOriginal)

let desconto = ""

if(atual && original){

const off = Math.round((1 - atual/original)*100)

desconto = off + "% OFF"

}

// detectar cupom
let cupom =
$('[class*="voucher"]').first().text() ||
"Ver cupom na página"

// reduzir link
const linkCurto = url.split("?")[0]

const texto = `🔥 SUPER OFERTA SHOPEE

${nome}

💰 De: ${precoOriginal || "-"}
💸 Por: ${precoAtual || "Ver preço no link"}

🔥 ${desconto}

🎟 Cupom: ${cupom}

🛒 Comprar agora 👇
${linkCurto}

⚡ Promoções mudam rápido`

res.json({
nome,
imagem,
precoAtual,
precoOriginal,
desconto,
cupom,
texto
})

}catch(err){

res.json({erro:"Erro ao buscar produto"})

}

})

app.listen(PORT, ()=>{
console.log("Servidor rodando")
})