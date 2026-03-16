const express = require("express")
const axios = require("axios")
const cheerio = require("cheerio")

const app = express()
const PORT = process.env.PORT || 3000

app.get("/", (req,res)=>{
res.send("Gerador Shopee Online")
})

app.get("/oferta", async (req,res)=>{

const url = req.query.url

try{

const {data} = await axios.get(url)

const $ = cheerio.load(data)

const nome = $('meta[property="og:title"]').attr("content")
const imagem = $('meta[property="og:image"]').attr("content")

let preco = $(".pdp-price").first().text()

if(!preco){
preco = "Ver preço no link"
}

const texto = `🔥 SUPER OFERTA SHOPEE

${nome}

💰 Preço: ${preco}

🛒 Comprar agora 👇
${url}

⚡ Promoções mudam rápido`

res.json({
nome,
preco,
imagem,
texto
})

}catch{

res.json({erro:"Erro ao buscar produto"})

}

})

app.listen(PORT, ()=>{
console.log("Servidor rodando")
})
