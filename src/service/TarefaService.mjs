const STORAGE_KEY = 'tarefas';

export class TarefaService {
  salvarTodas(tarefas) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tarefas));
  }

  buscarTodas() {
    const dados = localStorage.getItem(STORAGE_KEY);
    if (!dados) return [];
    try {
      return JSON.parse(dados);
    } catch {
      return [];
    }
  }
}
