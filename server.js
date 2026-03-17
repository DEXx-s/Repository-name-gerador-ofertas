const express = require("express")
const axios = require("axios")
const cheerio = require("cheerio")

const app = express()

app.get("/produto", async (req, res)=>{
  const url = req.query.url

  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    })

    const $ = cheerio.load(data)

    const titulo = $('meta[property="og:title"]').attr("content")
    const imagem = $('meta[property="og:image"]').attr("content")

    let preco = $("body").text().match(/R\$ ?\d+[,\.]\d+/)?.[0]

    res.json({
      titulo,
      preco,
      imagem
    })

  } catch (e){
    res.json({
      titulo: "Produto Shopee",
      preco: "",
      imagem: ""
    })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, ()=>console.log("API rodando"))