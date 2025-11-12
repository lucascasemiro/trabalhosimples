const express = require("express")
const sqlite3 = require("sqlite3").verbose()
const path = require("path")
const cors = require("cors")

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())
app.use(express.static("public"))

const db = new sqlite3.Database("./biblioteca.db", (err) => {
  if (err) console.error(err.message)
  else console.log("Conectado ao banco de dados SQLite.")
})

db.run(`CREATE TABLE IF NOT EXISTS livros (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  autor TEXT NOT NULL,
  genero TEXT NOT NULL,
  status TEXT DEFAULT 'Disponível'
)`)

app.get("/api/livros", (req, res) => {
  db.all("SELECT * FROM livros", (err, rows) => {
    if (err) {
      res.status(500).json({ erro: err.message })
    } else {
      res.json(rows)
    }
  })
})

app.post("/api/livros", (req, res) => {
  const { titulo, autor, genero, status } = req.body

  if (!titulo || !autor || !genero) {
    return res.status(400).json({ erro: "Título, autor e gênero são obrigatórios" })
  }

  db.run(
    "INSERT INTO livros (titulo, autor, genero, status) VALUES (?, ?, ?, ?)",
    [titulo, autor, genero, status || "Disponível"],
    function (err) {
      if (err) {
        res.status(500).json({ erro: err.message })
      } else {
        res.json({ id: this.lastID, titulo, autor, genero, status: status || "Disponível" })
      }
    },
  )
})

app.delete("/api/livros/:id", (req, res) => {
  const { id } = req.params

  db.run("DELETE FROM livros WHERE id = ?", [id], (err) => {
    if (err) {
      res.status(500).json({ erro: err.message })
    } else {
      res.json({ mensagem: "Livro deletado com sucesso" })
    }
  })
})

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})
