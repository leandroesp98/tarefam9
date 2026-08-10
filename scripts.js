const API_URL = "https://crudcrud.com/api/SEU_ENDPOINT_AQUI";

// ============================================================
// REFERÊNCIAS DOS ELEMENTOS DO DOM
// ============================================================
const form = document.getElementById("form-cliente");
const inputNome = document.getElementById("nome");
const inputEmail = document.getElementById("email");
const listaClientes = document.getElementById("lista-clientes");
const mensagemDiv = document.getElementById("mensagem");

// ============================================================
// INICIALIZAÇÃO
// ============================================================
document.addEventListener("DOMContentLoaded", listarClientes);
form.addEventListener("submit", cadastrarCliente);

// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================
function exibirMensagem(texto, tipo) {
  mensagemDiv.textContent = texto;
  mensagemDiv.className = `mensagem ${tipo}`;
  setTimeout(() => {
    mensagemDiv.textContent = "";
    mensagemDiv.className = "mensagem";
  }, 3000);
}

// ============================================================
// LISTAR CLIENTES (GET)
// ============================================================
async function listarClientes() {
  try {
    const resposta = await fetch(API_URL);

    if (!resposta.ok) {
      throw new Error(`Erro ao buscar clientes: ${resposta.status}`);
    }

    const clientes = await resposta.json();
    renderizarClientes(clientes);
  } catch (erro) {
    console.error(erro);
    exibirMensagem("Não foi possível carregar os clientes.", "erro");
  }
}

function renderizarClientes(clientes) {
  listaClientes.innerHTML = "";

  if (clientes.length === 0) {
    listaClientes.innerHTML = "<li>Nenhum cliente cadastrado.</li>";
    return;
  }

  clientes.forEach((cliente) => {
    const item = document.createElement("li");

    item.innerHTML = `
      <div class="cliente-info">
        <strong>${cliente.nome}</strong>
        <span>${cliente.email}</span>
      </div>
      <button class="btn-excluir" data-id="${cliente._id}">Excluir</button>
    `;

    listaClientes.appendChild(item);
  });

  // Adiciona o evento de exclusão a cada botão criado
  document.querySelectorAll(".btn-excluir").forEach((botao) => {
    botao.addEventListener("click", (evento) => {
      const id = evento.target.getAttribute("data-id");
      excluirCliente(id);
    });
  });
}

// ============================================================
// CADASTRAR CLIENTE (POST)
// ============================================================
async function cadastrarCliente(evento) {
  evento.preventDefault();

  const nome = inputNome.value.trim();
  const email = inputEmail.value.trim();

  if (!nome || !email) {
    exibirMensagem("Preencha nome e e-mail.", "erro");
    return;
  }

  const novoCliente = { nome, email };

  try {
    const resposta = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(novoCliente),
    });

    if (!resposta.ok) {
      throw new Error(`Erro ao cadastrar cliente: ${resposta.status}`);
    }

    exibirMensagem("Cliente cadastrado com sucesso!", "sucesso");
    form.reset();
    listarClientes();
  } catch (erro) {
    console.error(erro);
    exibirMensagem("Não foi possível cadastrar o cliente.", "erro");
  }
}

// ============================================================
// EXCLUIR CLIENTE (DELETE)
// ============================================================
async function excluirCliente(id) {
  try {
    const resposta = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!resposta.ok) {
      throw new Error(`Erro ao excluir cliente: ${resposta.status}`);
    }

    exibirMensagem("Cliente excluído com sucesso!", "sucesso");
    listarClientes();
  } catch (erro) {
    console.error(erro);
    exibirMensagem("Não foi possível excluir o cliente.", "erro");
  }
}
