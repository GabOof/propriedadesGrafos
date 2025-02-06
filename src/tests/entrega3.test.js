import {
  verificarCaminhoFechado,
  verificarEuleriano,
  contarComponentesConexos,
} from "../script";

describe("Funções de Grafo -> Entrega 2", () => {
  describe("verificarCaminhoFechado", () => {
    it("deve retornar true para um grafo com um caminho fechado", () => {
      const grafo = {
        1: [2, 3],
        2: [1, 3],
        3: [1, 2],
      };

      expect(verificarCaminhoFechado(grafo)).toBe(true);
    });

    it("deve retornar false para um grafo sem caminho fechado", () => {
      const grafo = {
        1: [2],
        2: [1],
      };

      expect(verificarCaminhoFechado(grafo)).toBe(false);
    });
  });

  describe("verificarEuleriano", () => {
    it("deve retornar true para um grafo Euleriano", () => {
      const grafoEuleriano = {
        1: [2, 3],
        2: [1, 3],
        3: [1, 2],
      };

      expect(verificarEuleriano(grafoEuleriano)).toBe(true);
    });

    it("deve retornar false para um grafo não Euleriano (grau ímpar em algum vértice)", () => {
      const grafoNaoEuleriano = {
        1: [2],
        2: [1, 3],
        3: [2],
      };

      expect(verificarEuleriano(grafoNaoEuleriano)).toBe(false);
    });

    it("deve retornar false para um grafo não Euleriano (grafo desconexo)", () => {
      const grafoDesconexo = {
        1: [2],
        2: [1],
        3: [4],
        4: [3],
      };

      expect(verificarEuleriano(grafoDesconexo)).toBe(false);
    });
  });

  describe("contarComponentesConexos", () => {
    it("deve contar corretamente o número de componentes conexos", () => {
      const grafoConexo = {
        1: [2],
        2: [1],
        3: [4],
        4: [3],
      };

      expect(contarComponentesConexos(grafoConexo)).toBe(2);
    });

    it("deve contar corretamente um grafo totalmente conectado", () => {
      const grafoConexoTotal = {
        1: [2, 3],
        2: [1, 3],
        3: [1, 2],
      };

      expect(contarComponentesConexos(grafoConexoTotal)).toBe(1);
    });
  });
});
