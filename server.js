const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

app.post("/criar-checkout", async (req, res) => {

  const { total } = req.body;

  try {

    const response = await fetch("https://api.checkout.infinitepay.io/links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        handle: "casado_lanche",
        items: [
          {
            quantity: 1,
            price: Math.round(total * 100),
            description: "Pedido Casa do Lanche"
          }
        ]
      })
    });

    const data = await response.json();

    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao gerar checkout" });
  }

});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));

const express = require("express");
const fetch = require("node-fetch");

const app = express();

// 🔥 LIBERAR CORS
const cors = require("cors");
app.use(cors());

app.use(express.json());