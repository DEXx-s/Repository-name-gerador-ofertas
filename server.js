const express = require("express")
const axios = require("axios")
const cheerio = require("cheerio")

const app = express()

app.use(express.static("."))

app.get("/produto", async (req,res)=>{

try{

const url = req.query.url

const response = await axios.get(url,{
headers:{
"User-Agent":"Mozilla/5.0",
"Accept-Language":"pt-BR,pt;q=0.9"
}
})

const html = response.data
const $ = cheerio.load(html)

let titulo =
$('meta[property="og:title"]').attr("content")

if(!titulo){
titulo = $("title").text()
}

if(!titulo){
titulo = "Produto Shopee"
}

res.json({
titulo: titulo
})

}catch(e){

res.json({
titulo:"Produto Shopee"
})

}

})

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
console.log("Servidor rodando")
})