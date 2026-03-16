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

if(!url){
return res.json({erro:"Link não informado"})
}

try{

const response = await axios.get(url,{
headers:{
"user-agent":"Mozilla/5.0"
},
maxRedirects:5
})

const html = response.data

const $ = cheerio.load(html)

const nome =
$('meta[property="og:title"]').attr("content") ||
"Produto Shopee"

const imagem =
$('meta[property="og:image"]').attr("content") ||
""

const texto = `🔥 SUPER OFERTA SHOPEE

${nome}

💰 Confira o preço no link

🛒 Comprar agora 👇
${url}

⚡ Promoções mudam rápido`

res.json({
nome,
imagem,
texto
})

}catch(e){

res.json({erro:"Erro ao gerar oferta"})

}

})

app.listen(PORT, ()=>{
console.log("Servidor rodando 🚀")
})