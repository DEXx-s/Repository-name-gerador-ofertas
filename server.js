const express = require("express")
const axios = require("axios")
const cheerio = require("cheerio")
const path = require("path")

const app = express()

const PORT = process.env.PORT || 3000

// servir arquivos estáticos
app.use(express.static(__dirname))

// página inicial
app.get("/", (req,res)=>{
res.send("Servidor funcionando 🚀")
})

// rota da oferta
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

}catch(err){

res.json({erro:"Erro ao buscar produto"})

}

})

// iniciar servidor
app.listen(PORT, ()=>{
console.log("Servidor rodando")
})