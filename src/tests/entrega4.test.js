import { criarGrafo, verificarIsomorfismo } from "../script"; // Ajuste o caminho conforme necessário

describe("Funções de Grafo -> Entrega 3", () => {
  describe("criarGrafo", () => {
    it("deve criar um grafo a partir de um array de arestas", () => {
      const arestas = [
        [1, 2],
        [2, 3],
        [3, 1],
      ];
      const grafo = criarGrafo(arestas);

      expect(grafo).toEqual({
        1: [2, 3],
        2: [1, 3],
        3: [2, 1],
      });
    });

    it("deve criar um grafo vazio se não houver arestas", () => {
      const arestas = [];
      const grafo = criarGrafo(arestas);

      expect(grafo).toEqual({});
    });
  });

  describe("verificarIsomorfismo", () => {
    it("deve retornar true para grafos isomorfos", () => {
      const arestasGrafoA = [
        [1, 2],
        [2, 3],
        [3, 1],
      ];
      const arestasGrafoB = [
        [4, 5],
        [5, 6],
        [6, 4],
      ];

      const grafoA = criarGrafo(arestasGrafoA);
      const grafoB = criarGrafo(arestasGrafoB);

      expect(verificarIsomorfismo(grafoA, grafoB)).toBe(true);
    });

    it("deve retornar false para grafos não isomorfos", () => {
      const arestasGrafoA = [
        [1, 2],
        [2, 3],
        [3, 1],
      ];
      const arestasGrafoB = [
        [4, 5],
        [5, 6],
      ];

      const grafoA = criarGrafo(arestasGrafoA);
      const grafoB = criarGrafo(arestasGrafoB);

      expect(verificarIsomorfismo(grafoA, grafoB)).toBe(false);
    });

    it("deve retornar false para grafos com diferentes números de vértices", () => {
      const arestasGrafoA = [
        [1, 2],
        [2, 3],
      ];
      const arestasGrafoB = [[4, 5]];

      const grafoA = criarGrafo(arestasGrafoA);
      const grafoB = criarGrafo(arestasGrafoB);

      expect(verificarIsomorfismo(grafoA, grafoB)).toBe(false);
    });

    it("deve retornar true para grafos isomorfos com diferentes rótulos", () => {
      const arestasGrafoA = [
        [1, 2],
        [2, 3],
        [3, 1],
      ];
      const arestasGrafoB = [
        [4, 5],
        [5, 6],
        [6, 4],
      ];

      const grafoA = criarGrafo(arestasGrafoA);
      const grafoB = criarGrafo(arestasGrafoB);

      expect(verificarIsomorfismo(grafoA, grafoB)).toBe(true);
    });

    it("deve retornar false para grafos que não são isomorfos devido a arestas diferentes", () => {
      const arestasGrafoA = [
        [1, 2],
        [2, 3],
      ];
      const arestasGrafoB = [
        [4, 5],
        [5, 6],
        [6, 4],
      ];

      const grafoA = criarGrafo(arestasGrafoA);
      const grafoB = criarGrafo(arestasGrafoB);

      expect(verificarIsomorfismo(grafoA, grafoB)).toBe(false);
    });
  });
});
