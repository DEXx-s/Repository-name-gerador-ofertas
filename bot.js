const puppeteer = require("puppeteer")
const cron = require("node-cron")

const produtos = [
"https://shopee.com.br/product/908325207/58254866088",
"https://shopee.com.br/product/OUTRO_LINK_AQUI"
]

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

🛒 COMPRE AQUI
${url}

⚠️ Promoção pode acabar a qualquer momento`
}

async function enviarOfertas(){

const browser = await puppeteer.launch({
headless:false,
args:["--no-sandbox"]
})

const page = await browser.newPage()

// abre WhatsApp Web
await page.goto("https://web.whatsapp.com")

console.log("Escaneie o QR CODE...")

await page.waitForSelector("._ak8q") // espera login

// abre grupo
await page.click("span[title='NOME DO SEU GRUPO']")

for(let url of produtos){

const mensagem = await gerarOferta(page,url)

// digita mensagem
await page.type("div[contenteditable='true']", mensagem)

// envia
await page.keyboard.press("Enter")

await new Promise(r=>setTimeout(r,5000))

}

}

// roda a cada 30 minutos
cron.schedule("*/30 * * * *", ()=>{
enviarOfertas()
})

console.log("BOT rodando...")