const puppeteer = require("puppeteer")
const cron = require("node-cron")
const axios = require("axios")

// 🔥 LISTA AUTOMÁTICA (pode trocar por API depois)
let produtos = [
"https://shopee.com.br/product/908325207/58254866088"
]

// 🧠 GERAR OFERTA
async function gerarOferta(page, url){

await page.goto(url,{waitUntil:"networkidle2"})

const data = await page.evaluate(()=>{

let titulo = document.querySelector("title")?.innerText

let preco = document.body.innerText.match(/R\$ ?\d+[,\.]\d+/)?.[0]

return {titulo,preco}

})

return `🔥 SUPER OFERTA

🛍️ ${data.titulo}

💰 ${data.preco}

🛒 COMPRE AGORA 👇
${url}

⚠️ Promoção pode acabar a qualquer momento`
}

// 🤖 POSTAR NO WHATSAPP
async function iniciarBot(){

const browser = await puppeteer.launch({
headless:false,
args:["--no-sandbox"]
})

const page = await browser.newPage()

await page.goto("https://web.whatsapp.com")

console.log("Escaneie o QR CODE")

await page.waitForSelector("._ak8q")

await page.click("span[title='SEU GRUPO AQUI']")

// LOOP INFINITO
setInterval(async ()=>{

const randomProduto = produtos[Math.floor(Math.random()*produtos.length)]

const mensagem = await gerarOferta(page, randomProduto)

// digita mensagem
await page.type("div[contenteditable='true']", mensagem)

// envia
await page.keyboard.press("Enter")

console.log("Oferta enviada")

}, 1000 * 60 * 20) // a cada 20 minutos

}

// 🚀 RODAR
iniciarBot()