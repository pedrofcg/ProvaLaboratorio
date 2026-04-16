import { Tarefa } from '../model/Tarefa.mjs';
import { TarefaService } from '../service/TarefaService.mjs';

export class TarefaController {
  constructor() {
    this.service = new TarefaService();
  }

  adicionarTarefa(descricao) {
    if (!descricao || descricao.trim() === '') {
      throw new Error('A descrição da tarefa não pode ser vazia.');
    }

    const tarefas = this._buscarTarefas();
    const novaTarefa = Tarefa.criar(descricao.trim());
    tarefas.push(novaTarefa);
    this.service.salvarTodas(tarefas);
    return novaTarefa;
  }

  listarTarefas() {
    return this._buscarTarefas();
  }

  atualizarTarefa(id, novosDados) {
    const tarefas = this._buscarTarefas();
    const index = tarefas.findIndex((t) => t.id === id);

    if (index === -1) return null;

    const { descricao, concluida } = novosDados;
    if (descricao !== undefined) {
      if (descricao.trim() === '') throw new Error('A descrição não pode ser vazia.');
      tarefas[index].descricao = descricao.trim();
    }
    if (concluida !== undefined) {
      tarefas[index].concluida = Boolean(concluida);
    }

    this.service.salvarTodas(tarefas);
    return tarefas[index];
  }

  removerTarefa(id) {
    const tarefas = this._buscarTarefas();
    const novaLista = tarefas.filter((t) => t.id !== id);

    if (novaLista.length === tarefas.length) return false;

    this.service.salvarTodas(novaLista);
    return true;
  }

  alternarConclusao(id) {
    const tarefas = this._buscarTarefas();
    const tarefa = tarefas.find((t) => t.id === id);
    if (!tarefa) return null;
    return this.atualizarTarefa(id, { concluida: !tarefa.concluida });
  }

  _buscarTarefas() {
    return this.service.buscarTodas().map(Tarefa.fromObject);
  }
}
