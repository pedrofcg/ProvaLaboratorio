export class Tarefa {
  constructor(descricao, id = null, concluida = false) {
    this.id = id ?? Tarefa.gerarId();
    this.descricao = descricao;
    this.concluida = concluida;
  }

  static gerarId() {
    return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
  }

  static criar(descricao) {
    return new Tarefa(descricao);
  }

  static fromObject(obj) {
    return new Tarefa(obj.descricao, obj.id, obj.concluida);
  }
}
