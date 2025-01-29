const { verificarCiclo, verificarBipartido } = require("../script"); // Importa as funções do arquivo principal

describe("Função de Grafo -> Entrega 2", () => {
  describe("Testes para detecção de ciclos", () => {
    test("Grafo sem ciclos deve retornar false", () => {
      const grafoSemCiclo = {
        1: [2],
        2: [1, 3],
        3: [2, 4],
        4: [3],
      };
      expect(verificarCiclo(grafoSemCiclo)).toBe(false);
    });

    test("Grafo com ciclo deve retornar true", () => {
      const grafoComCiclo = {
        1: [2, 3],
        2: [1, 4],
        3: [1, 4],
        4: [2, 3],
      };
      expect(verificarCiclo(grafoComCiclo)).toBe(true);
    });

    test("Grafo desconexo sem ciclo deve retornar false", () => {
      const grafoDesconexo = {
        1: [2],
        2: [1],
        3: [4],
        4: [3],
      };
      expect(verificarCiclo(grafoDesconexo)).toBe(false);
    });

    test("Grafo com laço (ciclo de um nó para ele mesmo) deve retornar true", () => {
      const grafoComLaco = {
        1: [2],
        2: [1, 2], // Laço aqui
      };
      expect(verificarCiclo(grafoComLaco)).toBe(true);
    });
  });

  describe("Testes para verificar se um grafo é bipartido", () => {
    test("Grafo bipartido deve retornar true", () => {
      const grafoBipartido = {
        1: [2, 3],
        2: [1, 4],
        3: [1, 5],
        4: [2, 6],
        5: [3, 6],
        6: [4, 5],
      };
      expect(verificarBipartido(grafoBipartido)).toBe(true);
    });

    test("Grafo não bipartido deve retornar false", () => {
      const grafoNaoBipartido = {
        1: [2, 3],
        2: [1, 3],
        3: [1, 2],
      };
      expect(verificarBipartido(grafoNaoBipartido)).toBe(false);
    });

    test("Grafo desconexo bipartido deve retornar true", () => {
      const grafoDesconexoBipartido = {
        1: [2],
        2: [1],
        3: [4],
        4: [3],
      };
      expect(verificarBipartido(grafoDesconexoBipartido)).toBe(true);
    });

    test("Grafo com um único nó deve ser bipartido", () => {
      const grafoUnicoNo = {
        1: [],
      };
      expect(verificarBipartido(grafoUnicoNo)).toBe(true);
    });
  });
});
