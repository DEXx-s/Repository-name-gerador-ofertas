const express = require("express")
const axios = require("axios")
const cheerio = require("cheerio")

const app = express()

app.use(express.static("."))

app.get("/produto", async (req,res)=>{

const url = req.query.url

try{

const response = await axios.get(url,{
headers:{
"User-Agent":"Mozilla/5.0"
}
})

const html = response.data
const $ = cheerio.load(html)

let titulo = $('meta[property="og:title"]').attr("content") 
          || $("title").text() 
          || "Produto Shopee"

let imagem = $('meta[property="og:image"]').attr("content") || ""

res.json({
titulo,
imagem
})

}catch(e){

res.json({
titulo:"Produto Shopee",
imagem:""
})

}

})

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
console.log("Servidor rodando")
})