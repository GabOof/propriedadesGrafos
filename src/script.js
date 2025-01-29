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

    `--------------------------------------------------------------------------------------------`,

    `Quantidade de componentes conexos: ${componentesConexos}`,

    verificarCompleto(grafo)
      ? "O grafo é completo."
      : "O grafo não é completo.",

    `--------------------------------------------------------------------------------------------`,

    verificarCiclo ? "O grafo contém ciclo." : "O grafo não contém ciclo.",
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

// Função para verificar a presença de um ciclo
function verificarCiclo(grafo) {
  const visitado = new Set(); // Cria um conjunto para armazenar os nodos visitados

  const recursaoVisitada = new Set(); // Cria um conjunto para armazenar os nodos visitados na recursão

  // Itera sobre os nodos do grafo e verifica se há ciclos
  for (const nodo in grafo) {
    if (!visitado.has(Number(nodo))) {
      if (
        // Utiliza a função auxiliar para detectar ciclos
        detectarCiclo(grafo, Number(nodo), visitado, recursaoVisitada, null)
      ) {
        return true; // Se encontrar um ciclo, retorna true
      }
    }
  }

  return false; // Se não encontrar nenhum ciclo
}

// Função auxiliar para detectar ciclos usando busca em profundidade (DFS)
function detectarCiclo(grafo, nodo, visitado, recursaoVisitada, pai) {
  // Verifica se o nó não está no grafo (ou seja, não tem vizinhos)
  if (!grafo[nodo]) {
    return false; // Se o nó não estiver no grafo, não pode fazer parte de um ciclo
  }

  // Marca o nó como visitado para evitar verificações repetidas
  visitado.add(nodo);

  // Adiciona o nó ao conjunto de nós da recursão atual
  recursaoVisitada.add(nodo);

  // Itera sobre os vizinhos (arestas) do nó atual
  for (const vizinho of grafo[nodo]) {
    // Se o vizinho ainda não foi visitado, faz uma chamada recursiva (DFS)
    if (!visitado.has(vizinho)) {
      // Se algum vizinho retornar true, significa que há um ciclo
      if (detectarCiclo(grafo, vizinho, visitado, recursaoVisitada, nodo)) {
        return true; // Ciclo encontrado, retorna true imediatamente
      }
    }
    // Se o vizinho já foi visitado e não for o pai direto do nó atual, há um ciclo
    else if (vizinho !== pai && recursaoVisitada.has(vizinho)) {
      return true; // O nó está na pilha de recursão, então há um ciclo
    }
  }

  // Remove o nó do conjunto de nós da recursão, pois a DFS dele terminou
  recursaoVisitada.delete(nodo);

  // Se nenhum ciclo foi encontrado, retorna false
  return false;
}

// Vincular a função de verificação ao evento de clique do botão
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("button").addEventListener("click", verificarGrafo);
});
