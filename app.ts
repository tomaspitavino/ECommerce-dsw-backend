import express from "express";

// get /api/characters/ -> obtener lista de characters
// get /api/characters/:id -> obtener el character con id = id
// put y patch /api/characters/:id -> modifican characters con id = id (tienen sus diferencias)

const cliente = [
    new Cliente{
        // atributos aca
    }
]

const app = express();

const port = 3000;

app.use("/", (req, res) => {
  res.json({ message: "<h1>Holaaaaaa</h1>" });
});

app.get('/api/clientes',(req,res)=> {
    res.json(clientes)
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/`);
});
