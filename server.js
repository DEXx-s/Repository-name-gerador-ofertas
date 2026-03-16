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

// abre o link curto e segue redirecionamento
const response = await axios.get(url,{
headers:{
"user-agent":"Mozilla/5.0"
},
maxRedirects:10
})

const html = response.data

let nome=""
let precoAtual=""
let precoOriginal=""
let imagem=""

// tenta pegar JSON interno da Shopee
try{

const jsonMatch = html.match(/window\.__INITIAL_STATE__\s*=\s*(\{.*?\});/)

if(jsonMatch){

const json = JSON.parse(jsonMatch[1])

if(json.item){

nome = json.item.name

imagem = "https://cf.shopee.com.br/file/"+json.item.image

if(json.item.price){
precoAtual = "R$ "+(json.item.price/100000).toFixed(2)
}

if(json.item.price_before_discount){
precoOriginal = "R$ "+(json.item.price_before_discount/100000).toFixed(2)
}

}

}

}catch(e){}

// fallback se não achar JSON
if(!nome){

const $ = cheerio.load(html)

nome =
$('meta[property="og:title"]').attr("content") ||
$("title").text()

imagem =
$('meta[property="og:image"]').attr("content")

}

const linkLimpo = url.split("?")[0]

res.json({
nome,
precoAtual,
precoOriginal,
imagem,
link:linkLimpo
})

}catch(err){

res.json({erro:"Erro ao gerar oferta"})

}

})

app.listen(PORT, ()=>{
console.log("Servidor rodando 🚀")
})