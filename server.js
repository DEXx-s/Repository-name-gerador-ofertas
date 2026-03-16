app.get("/oferta", async (req,res)=>{

const url = req.query.url

try{

const response = await axios.get(url,{
headers:{ "User-Agent":"Mozilla/5.0" },
maxRedirects:5
})

const html = response.data

let nome = ""
let imagem = ""
let precoAtual = ""
let precoOriginal = ""
let desconto = ""

try{

const jsonMatch = html.match(/window.__INITIAL_STATE__ = (.*?);/)

if(jsonMatch){

const data = JSON.parse(jsonMatch[1])

const produto = data.item

if(produto){

nome = produto.name || ""

imagem = "https://cf.shopee.com.br/file/" + produto.image

if(produto.price){
precoAtual = "R$ " + (produto.price/100000).toFixed(2)
}

if(produto.price_before_discount){

precoOriginal = "R$ " + (produto.price_before_discount/100000).toFixed(2)

const atual = produto.price/100000
const original = produto.price_before_discount/100000

const off = Math.round((1 - atual/original)*100)

desconto = off + "% OFF"

}

}

}

}catch(e){
// ignora erro JSON
}

if(!nome){

const $ = cheerio.load(html)

nome =
$('meta[property="og:title"]').attr("content") ||
$("title").text()

imagem =
$('meta[property="og:image"]').attr("content")

}

const linkCurto = url.split("?")[0]

const texto = `🔥 SUPER OFERTA SHOPEE

${nome}

💰 De: ${precoOriginal || "-"}
💸 Por: ${precoAtual || "Ver preço no link"}

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