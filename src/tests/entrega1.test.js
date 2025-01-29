import {
  processarArestas,
  criarGrafo,
  contarComponentesConexos,
  verificarCompleto,
} from "../script";

describe("Funções de Grafo -> Entrega 1", () => {
  describe("processarArestas", () => {
    it("deve processar uma entrada válida de arestas", () => {
      const input = "[ [1, 2], [2, 3], [3, 4] ]";
      const resultado = processarArestas(input);
      expect(resultado).toEqual([
        [1, 2],
        [2, 3],
        [3, 4],
      ]);
    });

    it("deve retornar null para entrada inválida", () => {
      const input = '[ [1, 2], [2, "3"], [3, 4] ]';
      const resultado = processarArestas(input);
      expect(resultado).toBeNull();
    });

    it("deve retornar null para entradas não parseáveis", () => {
      const input = "[ [1, 2], [2, 3], 3, 4 ]";
      const resultado = processarArestas(input);
      expect(resultado).toBeNull();
    });
  });

  describe("criarGrafo", () => {
    it("deve criar um grafo a partir das arestas fornecidas", () => {
      const arestas = [
        [1, 2],
        [2, 3],
        [3, 4],
      ];
      const grafo = criarGrafo(arestas);
      expect(grafo).toEqual({
        1: [2],
        2: [1, 3],
        3: [2, 4],
        4: [3],
      });
    });

    it("deve criar um grafo vazio se não houver arestas", () => {
      const arestas = [];
      const grafo = criarGrafo(arestas);
      expect(grafo).toEqual({});
    });
  });

  describe("contarComponentesConexos", () => {
    it("deve contar corretamente o número de componentes conexos", () => {
      const grafo = {
        1: [2],
        2: [1, 3],
        3: [2],
        4: [5],
        5: [4],
      };
      const componentesConexos = contarComponentesConexos(grafo);
      expect(componentesConexos).toBe(2);
    });

    it("deve retornar 1 se o grafo for totalmente conectado", () => {
      const grafo = {
        1: [2],
        2: [1, 3],
        3: [2],
      };
      const componentesConexos = contarComponentesConexos(grafo);
      expect(componentesConexos).toBe(1);
    });

    it("deve retornar o número correto de componentes para grafo desconexo", () => {
      const grafo = {
        1: [2],
        2: [1],
        3: [],
        4: [],
      };
      const componentesConexos = contarComponentesConexos(grafo);
      expect(componentesConexos).toBe(3);
    });
  });

  describe("verificarCompleto", () => {
    it("deve retornar true se o grafo for completo", () => {
      const grafo = {
        1: [2, 3],
        2: [1, 3],
        3: [1, 2],
      };
      const completo = verificarCompleto(grafo);
      expect(completo).toBe(true);
    });

    it("deve retornar false se o grafo não for completo", () => {
      const grafo = {
        1: [2],
        2: [1],
        3: [],
      };
      const completo = verificarCompleto(grafo);
      expect(completo).toBe(false);
    });

    it("deve retornar true se o grafo for completo com mais vértices", () => {
      const grafo = criarGrafo([
        [1, 2],
        [1, 3],
        [1, 4],
        [2, 1],
        [2, 3],
        [2, 4],
        [3, 1],
        [3, 2],
        [3, 4],
        [4, 1],
        [4, 2],
        [4, 3],
      ]);
      const completo = verificarCompleto(grafo);
      expect(completo).toBe(true);
    });
  });
});
