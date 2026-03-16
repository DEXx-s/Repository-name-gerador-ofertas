app.get("/oferta", async (req,res)=>{

const url = req.query.url

try{

const response = await axios.get(url,{
headers:{
"User-Agent":"Mozilla/5.0"
}
})

const html = response.data

// pegar JSON interno da Shopee
const jsonMatch = html.match(/window.__INITIAL_STATE__ = (.*?);/)

let precoAtual = ""
let precoOriginal = ""
let nome = ""
let imagem = ""

if(jsonMatch){

const data = JSON.parse(jsonMatch[1])

const produto = data.item

nome = produto.name

imagem = "https://cf.shopee.com.br/file/" + produto.image

precoAtual = "R$ " + (produto.price/100000).toFixed(2)

precoOriginal = produto.price_before_discount
? "R$ " + (produto.price_before_discount/100000).toFixed(2)
: ""

}

let desconto = ""

if(precoOriginal){

const atual = parseFloat(precoAtual.replace("R$",""))
const original = parseFloat(precoOriginal.replace("R$",""))

const off = Math.round((1 - atual/original)*100)

desconto = off + "% OFF"

}

const linkCurto = url.split("?")[0]

const texto = `🔥 SUPER OFERTA SHOPEE

${nome}

💰 De: ${precoOriginal || "-"}
💸 Por: ${precoAtual}

🔥 ${desconto}

🛒 Comprar agora 👇
${linkCurto}

⚡ Promoções mudam rápido`

res.json({
nome,
imagem,
precoAtual,
precoOriginal,
desconto,
texto
})

}catch(err){

res.json({erro:"Erro ao buscar produto"})

}

})