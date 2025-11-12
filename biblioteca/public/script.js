const API_URL = "http://localhost:3000/api"
const modal = document.getElementById("modal")
const btnAdicionar = document.getElementById("btnAdicionar")
const closeBtn = document.querySelector(".close")
const formLivro = document.getElementById("formLivro")
const gridLivros = document.getElementById("gridLivros")

btnAdicionar.addEventListener("click", () => {
  modal.style.display = "block"
})

closeBtn.addEventListener("click", () => {
  modal.style.display = "none"
})

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none"
  }
})

formLivro.addEventListener("submit", async (e) => {
  e.preventDefault()

  const titulo = document.getElementById("titulo").value
  const autor = document.getElementById("autor").value
  const genero = document.getElementById("genero").value
  const status = document.getElementById("status").value

  try {
    const response = await fetch(`${API_URL}/livros`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ titulo, autor, genero, status }),
    })

    if (response.ok) {
      formLivro.reset()
      modal.style.display = "none"
      carregarLivros()
    } else {
      alert("Erro ao adicionar livro")
    }
  } catch (error) {
    console.error("Erro:", error)
    alert("Erro ao conectar ao servidor")
  }
})

async function carregarLivros() {
  try {
    const response = await fetch(`${API_URL}/livros`)
    const livros = await response.json()

    gridLivros.innerHTML = ""

    if (livros.length === 0) {
      gridLivros.innerHTML = '<div class="vazio">Nenhum livro cadastrado ainda</div>'
      return
    }

    livros.forEach((livro) => {
      const livroElement = document.createElement("div")
      livroElement.className = "livro"
      livroElement.innerHTML = `
                <button class="livro-deletar" data-id="${livro.id}">&times;</button>
                <div class="livro-info">
                    <div class="livro-titulo">${livro.titulo}</div>
                    <div class="livro-autor">${livro.autor}</div>
                    <div class="livro-genero">${livro.genero}</div>
                </div>
                <div class="livro-status">${livro.status}</div>
            `

      livroElement.querySelector(".livro-deletar").addEventListener("click", () => {
        deletarLivro(livro.id)
      })

      gridLivros.appendChild(livroElement)
    })
  } catch (error) {
    console.error("Erro ao carregar livros:", error)
  }
}

async function deletarLivro(id) {
  if (confirm("Tem certeza que deseja deletar este livro?")) {
    try {
      const response = await fetch(`${API_URL}/livros/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        carregarLivros()
      } else {
        alert("Erro ao deletar livro")
      }
    } catch (error) {
      console.error("Erro:", error)
    }
  }
}

carregarLivros()
