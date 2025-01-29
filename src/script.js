// Função para converter a entrada de texto em arestas
function processarArestas(input) {
  try {
    const analisado = JSON.parse(input); // Tenta converter a string em um objeto JSON

    // Verifica se o input é um array de pares de números inteiros
    if (
      Array.isArray(analisado) &&
      analisado.every(
        (aresta) =>
          Array.isArray(aresta) &&
          aresta.length === 2 &&
          aresta.every((nodo) => Number.isInteger(nodo))
      )
    ) {
      return analisado;
    }

    return null; // Retorna null para entradas inválidas
  } catch (e) {
    return null; // Retorna null para entradas não parseáveis
  }
}

// Função para criar o grafo a partir das arestas fornecidas
function criarGrafo(arestas) {
  const grafo = {}; // Cria um objeto vazio para representar o grafo

  // Itera sobre as arestas e adiciona cada uma ao grafo
  arestas.forEach(([u, v]) => {
    // Se o nó não existe, adiciona-o ao grafo
    if (!grafo[u]) grafo[u] = [];
    if (!grafo[v]) grafo[v] = [];

    // Adiciona a aresta ao grafo
    grafo[u].push(v);
    grafo[v].push(u); // Grafo não direcionado (-->)
  });

  return grafo;
}
