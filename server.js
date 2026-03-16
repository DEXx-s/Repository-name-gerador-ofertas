const express = require("express")
const axios = require("axios")
const cheerio = require("cheerio")

const app = express()

app.get("/produto", async (req,res)=>{

const url = req.query.url

try{

const {data} = await axios.get(url)

const $ = cheerio.load(data)

const nome = $('meta[property="og:title"]').attr("content")
const imagem = $('meta[property="og:image"]').attr("content")

const preco = $(".pdp-price").first().text() || "Ver na página"

res.json({
nome,
imagem,
preco
})

}catch{

res.json({erro:"erro ao buscar produto"})

}

})

app.listen(3000, ()=>{
console.log("Servidor rodando")
})
