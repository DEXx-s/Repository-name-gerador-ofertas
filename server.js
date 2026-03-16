const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Servidor funcionando!");
});

app.get("/produto", async (req, res) => {
  const url = req.query.url;

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const nome = $('meta[property="og:title"]').attr("content");
    const imagem = $('meta[property="og:image"]').attr("content");

    const preco = $(".pdp-price").first().text() || "Preço não encontrado";

    res.json({
      nome,
      imagem,
      preco
    });
  } catch (err) {
    res.json({ erro: "Erro ao buscar produto" });
  }
});

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
