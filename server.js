const express = require("express")
const axios = require("axios")
const cheerio = require("cheerio")

const app = express()

app.use(express.static("."))

app.get("/produto", async (req,res)=>{

try{

let url = req.query.url

// segue redirecionamento da Shopee
const redirect = await axios.get(url,{
maxRedirects:5,
headers:{
"User-Agent":"Mozilla/5.0"
}
})

url = redirect.request.res.responseUrl

// pega página real do produto
const response = await axios.get(url,{
headers:{
"User-Agent":"Mozilla/5.0"
}
})

const html = response.data
const $ = cheerio.load(html)

const titulo =
$('meta[property="og:title"]').attr("content") ||
$("title").text() ||
"Produto Shopee"

res.json({ titulo })

}catch(e){

res.json({ titulo:"Produto Shopee" })

}

})

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
console.log("Servidor rodando")
})