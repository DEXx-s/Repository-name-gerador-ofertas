app.get("/oferta", async (req,res)=>{

const url = req.query.url

try{

const response = await axios.get(url,{
headers:{
"user-agent":"Mozilla/5.0"
}
})

const html = response.data

let nome = ""
let imagem = ""
let precoAtual = ""
let precoOriginal = ""
let desconto = ""

try{

const jsonMatch = html.match(/window\.__INITIAL_STATE__\s*=\s*(\{.*?\});/)

if(jsonMatch){

const data = JSON.parse(jsonMatch[1])

const item = data.item

if(item){

nome = item.name

imagem = "https://cf.shopee.com.br/file/"+item.image

if(item.price){
precoAtual = "R$ "+(item.price/100000).toFixed(2)
}

if(item.price_before_discount){

precoOriginal = "R$ "+(item.price_before_discount/100000).toFixed(2)

const p1 = item.price_before_discount
const p2 = item.price

const off = Math.round((1 - p2/p1)*100)

desconto = off+"% OFF"

}

}

}

}catch(e){}

if(!nome){

const $ = cheerio.load(html)

nome =
$('meta[property="og:title"]').attr("content") ||
"Produto Shopee"

imagem =
$('meta[property="og:image"]').attr("content")

}

const linkLimpo = url.split("?")[0]

const texto = `🔥 SUPER OFERTA SHOPEE

${nome}

💰 De: ${precoOriginal || "-"}
💸 Por: ${precoAtual || "Ver preço no link"}

🔥 ${desconto}

🛒 Comprar agora 👇
${linkLimpo}

⚡ Promoções mudam rápido`

res.json({
nome,
imagem,
precoAtual,
precoOriginal,
desconto,
texto,
link:linkLimpo
})

}catch(err){

res.json({erro:"Erro ao gerar oferta"})

}

})