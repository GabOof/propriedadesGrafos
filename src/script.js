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

// Função para contar o número de componentes conexos no grafo
function contarComponentesConexos(grafo) {
  const visitado = new Set(); // Cria um conjunto para armazenar os nodos visitados

  let componentesConexos = 0; // Inicializa o contador de componentes conexos

  for (const nodo in grafo) {
    // Verifica se o nodo já foi visitado e, se não, realiza busca por profundidade
    if (!visitado.has(Number(nodo))) {
      buscaProfundidade(grafo, Number(nodo), visitado); // Realiza busca por profundidade para marcar todos os nodos conectados
      componentesConexos++; // Incrementa o contador de componentes conexos
    }
  }
  return componentesConexos;
}

// Função auxiliar para realizar busca por profundidade
function buscaProfundidade(grafo, nodo, visitado) {
  if (!grafo[nodo]) {
    return; // Se o nó não estiver no grafo, retorna
  }

  visitado.add(nodo); // Marca o nó como visitado

  grafo[nodo].forEach((v) => {
    // Verifica se o vizinho não foi visitado e, se não, realiza busca por profundidade
    if (!visitado.has(v)) {
      buscaProfundidade(grafo, v, visitado); // Realiza busca por profundidade para marcar todos os nodos conectados
    }
  });
}
