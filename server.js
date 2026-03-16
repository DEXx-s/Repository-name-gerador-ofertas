const express = require("express")

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static(__dirname))

app.get("/oferta", async (req,res)=>{

const url = req.query.url

try{

const api = "https://api.microlink.io?url=" + encodeURIComponent(url)

const response = await fetch(api)

const data = await response.json()

const title = data.data.title || "Produto Shopee"
const image = data.data.image?.url || ""

res.json({
title,
image,
price:"",
url
})

}catch(e){

res.json({
title:"Erro ao pegar produto",
image:"",
price:""
})

}

})

app.listen(PORT,()=>console.log("Servidor rodando"))