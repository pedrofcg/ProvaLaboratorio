import { TarefaController } from './src/controller/TarefaController.mjs';

const controller = new TarefaController();

const formAdicionar = document.getElementById('form-adicionar');
const inputDescricao = document.getElementById('input-descricao');
const listaTarefas = document.getElementById('lista-tarefas');
const contadorTotal = document.getElementById('contador-total');
const contadorConcluidas = document.getElementById('contador-concluidas');
const btnLimparConcluidas = document.getElementById('btn-limpar-concluidas');
const toastEl = document.getElementById('toast');

const modalEditar = document.getElementById('modal-editar');
const inputEditarDescricao = document.getElementById('input-editar-descricao');
const formEditar = document.getElementById('form-editar');
let idEmEdicao = null;

function mostrarToast(mensagem, tipo = 'success') {
  toastEl.textContent = mensagem;
  toastEl.className = `toast toast--${tipo} toast--visivel`;
  clearTimeout(toastEl._timer);
  toastEl._timer = setTimeout(() => {
    toastEl.classList.remove('toast--visivel');
  }, 2800);
}

function atualizarContadores(tarefas) {
  contadorTotal.textContent = tarefas.length;
  contadorConcluidas.textContent = tarefas.filter((t) => t.concluida).length;
}

function criarElementoTarefa(tarefa) {
  const li = document.createElement('li');
  li.className = `tarefa-item${tarefa.concluida ? ' tarefa-item--concluida' : ''}`;
  li.dataset.id = tarefa.id;

  li.innerHTML = `
    <button
      class="tarefa-checkbox"
      aria-label="${tarefa.concluida ? 'Marcar como pendente' : 'Marcar como concluída'}"
      data-action="alternar"
      data-id="${tarefa.id}"
    >
      <span class="tarefa-checkbox__icon">${tarefa.concluida ? '✓' : ''}</span>
    </button>

    <span class="tarefa-descricao">${escaparHTML(tarefa.descricao)}</span>

    <div class="tarefa-acoes">
      <button
        class="btn-acao btn-acao--editar"
        aria-label="Editar tarefa"
        data-action="editar"
        data-id="${tarefa.id}"
        title="Editar"
      >✎</button>
      <button
        class="btn-acao btn-acao--remover"
        aria-label="Remover tarefa"
        data-action="remover"
        data-id="${tarefa.id}"
        title="Remover"
      >✕</button>
    </div>
  `;

  return li;
}

function escaparHTML(texto) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(texto));
  return div.innerHTML;
}

function renderizarLista() {
  const tarefas = controller.listarTarefas();
  listaTarefas.innerHTML = '';

  if (tarefas.length === 0) {
    listaTarefas.innerHTML = `
      <li class="lista-vazia">
        <span class="lista-vazia__icone">📋</span>
        <p>Nenhuma tarefa ainda. Adicione uma acima!</p>
      </li>`;
  } else {
    tarefas.forEach((tarefa) => {
      listaTarefas.appendChild(criarElementoTarefa(tarefa));
    });
  }

  atualizarContadores(tarefas);
}

formAdicionar.addEventListener('submit', (e) => {
  e.preventDefault();
  const descricao = inputDescricao.value.trim();
  if (!descricao) return;

  try {
    controller.adicionarTarefa(descricao);
    inputDescricao.value = '';
    inputDescricao.focus();
    renderizarLista();
    mostrarToast('Tarefa adicionada com sucesso!');
  } catch (err) {
    mostrarToast(err.message, 'error');
  }
});

listaTarefas.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;

  const { action, id } = btn.dataset;

  if (action === 'alternar') {
    controller.alternarConclusao(id);
    renderizarLista();
    const tarefas = controller.listarTarefas();
    const tarefa = tarefas.find((t) => t.id === id);
    mostrarToast(tarefa?.concluida ? 'Tarefa concluída! 🎉' : 'Tarefa reaberta.');
  }

  if (action === 'remover') {
    if (!confirm('Tem certeza que deseja remover esta tarefa?')) return;
    const removida = controller.removerTarefa(id);
    if (removida) {
      renderizarLista();
      mostrarToast('Tarefa removida.');
    }
  }

  if (action === 'editar') {
    const tarefas = controller.listarTarefas();
    const tarefa = tarefas.find((t) => t.id === id);
    if (!tarefa) return;
    idEmEdicao = id;
    inputEditarDescricao.value = tarefa.descricao;
    modalEditar.classList.add('modal--aberto');
    inputEditarDescricao.focus();
  }
});

formEditar.addEventListener('submit', (e) => {
  e.preventDefault();
  const novaDescricao = inputEditarDescricao.value.trim();
  if (!novaDescricao) return;

  try {
    controller.atualizarTarefa(idEmEdicao, { descricao: novaDescricao });
    modalEditar.classList.remove('modal--aberto');
    idEmEdicao = null;
    renderizarLista();
    mostrarToast('Tarefa atualizada!');
  } catch (err) {
    mostrarToast(err.message, 'error');
  }
});

modalEditar.addEventListener('click', (e) => {
  if (e.target === modalEditar) {
    modalEditar.classList.remove('modal--aberto');
    idEmEdicao = null;
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalEditar.classList.contains('modal--aberto')) {
    modalEditar.classList.remove('modal--aberto');
    idEmEdicao = null;
  }
});

btnLimparConcluidas.addEventListener('click', () => {
  const tarefas = controller.listarTarefas();
  const concluidas = tarefas.filter((t) => t.concluida);
  if (concluidas.length === 0) {
    mostrarToast('Nenhuma tarefa concluída para remover.', 'error');
    return;
  }
  if (!confirm(`Remover ${concluidas.length} tarefa(s) concluída(s)?`)) return;
  concluidas.forEach((t) => controller.removerTarefa(t.id));
  renderizarLista();
  mostrarToast(`${concluidas.length} tarefa(s) removida(s).`);
});

renderizarLista();
