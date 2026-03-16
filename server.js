const express = require("express")

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static(__dirname))

app.get("/oferta", async (req,res)=>{

const url = req.query.url

try{

const response = await fetch(url,{
headers:{
"User-Agent":
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
}
})

const html = await response.text()

const titleMatch = html.match(/property="og:title" content="([^"]+)"/)
const imageMatch = html.match(/property="og:image" content="([^"]+)"/)
const priceMatch = html.match(/R\$ ?\d+,\d+/)

const title = titleMatch ? titleMatch[1] : "Produto Shopee"
const image = imageMatch ? imageMatch[1] : ""
const price = priceMatch ? priceMatch[0] : ""

res.json({title,image,price})

}catch(e){

res.json({
title:"Erro ao pegar produto",
price:"",
image:""
})

}

})

app.listen(PORT,()=>{
console.log("Servidor rodando")
})