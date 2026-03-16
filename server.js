const express = require("express")

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static(__dirname))

app.get("/oferta", async (req,res)=>{

const url = req.query.url

try{

const response = await fetch(url)

const html = await response.text()

const titleMatch = html.match(/property="og:title" content="([^"]+)"/)
const imageMatch = html.match(/property="og:image" content="([^"]+)"/)

let priceMatch = html.match(/R\$ ?\d+,\d+/)

const title = titleMatch ? titleMatch[1] : "Produto Shopee"
const image = imageMatch ? imageMatch[1] : ""
const price = priceMatch ? priceMatch[0] : ""

res.json({
title,
image,
price
})

}catch(err){

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