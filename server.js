const express = require("express")

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static(__dirname))

app.get("/oferta", async (req,res)=>{

const shortUrl = req.query.url

try{

// resolve link curto
const redirect = await fetch(shortUrl,{redirect:"follow"})
const finalUrl = redirect.url

// pega html da página final
const response = await fetch(finalUrl,{
headers:{
"user-agent":
"Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
}
})

const html = await response.text()

// pega dados JSON da página
const jsonMatch = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)

let title=""
let image=""
let price=""

if(jsonMatch){

const data = JSON.parse(jsonMatch[1])

title = data.name || ""
image = data.image || ""
price = data.offers?.price
? "R$ " + data.offers.price
: ""

}

res.json({
title,
image,
price,
url:finalUrl
})

}catch(err){

res.json({
title:"Erro ao pegar produto",
price:"",
image:""
})

}

})

app.listen(PORT,()=>console.log("Servidor rodando"))