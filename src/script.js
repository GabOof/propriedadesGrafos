// Função principal para verificar propriedades do grafo
export function verificarGrafo() {
  // Obtem as arestas do grafo A e, opcionalmente, do grafo B
  const entradaArestas = document.getElementById("arestas").value;

  // Converte as arestas da entrada de texto para formato de array
  const arestas = processarArestas(entradaArestas);

  // Obtem elementos da interface para exibir os resultados
  const resultado = document.getElementById("detalhesResultado");
  const listaResultados = document.getElementById("listaResultados");
  const visualizacaoGrafo = document.getElementById("visualizacaoGrafo");

  // Limpa os resultados anteriores
  while (listaResultados.firstChild) {
    listaResultados.removeChild(listaResultados.firstChild);
  }

  // Limpa o canvas do grafo
  visualizacaoGrafo.innerHTML = "";

  // Caso a entrada de arestas seja inválida, exibe mensagem de erro
  if (!arestas) {
    const erro = document.createElement("li");
    erro.classList.add("erro");
    erro.textContent =
      "Entrada inválida. Por favor, forneça as arestas no formato correto (ex: [[1, 2], [1, 3]])";
    listaResultados.appendChild(erro);
    resultado.style.display = "block";
    return;
  }

  // Cria o grafo a partir das arestas fornecidas
  const grafo = criarGrafo(arestas);

  // Calcula propriedades do grafo
  const componentesConexos = contarComponentesConexos(grafo);

  // Gera detalhes para exibição
  let detalhes = [
    `Arestas fornecidas: ${JSON.stringify(arestas)}`,

    `Quantidade de componentes conexos: ${componentesConexos}`,

    verificarCompleto(grafo)
      ? "O grafo é completo."
      : "O grafo não é completo.",
  ];

  // Exibe os detalhes na interface
  detalhes.forEach((detalhe) => {
    const item = document.createElement("li");
    item.textContent = detalhe;
    listaResultados.appendChild(item);
  });

  // Exibe o painel de resultados
  resultado.style.display = "block";

  // Visualiza o grafo com a biblioteca Vis.js
  const nodes = new vis.DataSet();
  const arestasVis = new vis.DataSet();

  const vertices = new Set();

  arestas.forEach(([v1, v2]) => {
    vertices.add(v1);
    vertices.add(v2);
  });

  vertices.forEach((vertex) => {
    nodes.add({ id: vertex, label: String(vertex) });
  });

  arestas.forEach(([v1, v2]) => {
    arestasVis.add({ from: v1, to: v2 });
  });

  const container = visualizacaoGrafo;
  const data = { nodes: nodes, edges: arestasVis };
  const options = {
    width: "100%",
    height: "100%",
    physics: {
      enabled: true,
    },
  };

  new vis.Network(container, data, options);
}

// Função para converter a entrada de texto em arestas
export function processarArestas(input) {
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
export function criarGrafo(arestas) {
  const grafo = {}; // Cria um objeto vazio para representar o grafo

  // Itera sobre as arestas e adiciona cada uma ao grafo
  arestas.forEach(([u, v]) => {
    // Se o nó não existe, adiciona-o ao grafo
    if (!grafo[u]) grafo[u] = [];
    if (!grafo[v]) grafo[v] = [];

    // Adiciona a aresta apenas se não existir
    if (!grafo[u].includes(v)) grafo[u].push(v);
    if (!grafo[v].includes(u)) grafo[v].push(u); // Grafo não direcionado (-->)
  });

  return grafo;
}

// Função para contar o número de componentes conexos no grafo
export function contarComponentesConexos(grafo) {
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

// Função para verificar se o grafo é completo
export function verificarCompleto(grafo) {
  const vertices = Object.keys(grafo); // Obtem os nodos do grafo

  const n = vertices.length; // Obtem o número de nodos do grafo

  // Verifica se cada vértice está conectado a todos os outros
  for (const vertice of vertices) {
    if (grafo[vertice].length !== n - 1) {
      return false; // Se algum vértice não estiver conectado a todos os outros, não é completo
    }
  }
  return true;
}

// Vincular a função de verificação ao evento de clique do botão
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("button").addEventListener("click", verificarGrafo);
});
