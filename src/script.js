// Função principal para verificar propriedades do grafo
function verificarGrafo() {
  // Obtém a entrada de arestas fornecida pelo usuário no campo de texto
  const entradaArestas = document.getElementById("arestas").value;

  // Converte a entrada de texto para um array de arestas
  const arestas = processarArestas(entradaArestas);

  // Obtém os elementos da interface onde os resultados serão exibidos
  const resultado = document.getElementById("detalhesResultado");
  const listaResultados = document.getElementById("listaResultados");
  const visualizacaoGrafo = document.getElementById("visualizacaoGrafo");

  // Limpa os resultados anteriores, removendo todos os elementos filhos da lista
  while (listaResultados.firstChild) {
    listaResultados.removeChild(listaResultados.firstChild);
  }

  // Limpa o canvas onde o grafo será visualizado
  visualizacaoGrafo.innerHTML = "";

  // Caso a entrada de arestas seja inválida, exibe uma mensagem de erro e retorna
  if (!arestas) {
    const erro = document.createElement("li");
    erro.classList.add("erro");
    erro.textContent =
      "Entrada inválida. Por favor, forneça as arestas no formato correto (ex: [[1, 2], [1, 3]])";
    listaResultados.appendChild(erro);
    resultado.style.display = "block";
    return;
  }

  // Cria o grafo como um objeto a partir das arestas fornecidas
  const grafo = criarGrafo(arestas);

  // Calcula o número de componentes conexos do grafo
  const componentesConexos = contarComponentesConexos(grafo);

  // Verifica se o grafo contém ciclos
  const contemCiclo = verificarGrafoCiclo(grafo);

  // Verifica se o grafo contém um caminho fechado
  const contemCaminhoFechado = verificarCaminhoFechado(grafo);

  // Cria os detalhes das propriedades do grafo para exibição
  let detalhes = [
    `Arestas fornecidas: ${JSON.stringify(arestas)}`,
    `--------------------------------------------------------------------------------------------`,
    `Quantidade de componentes conexos: ${componentesConexos}`,
    verificarCompleto(grafo)
      ? "O grafo é completo."
      : "O grafo não é completo.",
    `--------------------------------------------------------------------------------------------`,
    contemCiclo ? "O grafo contém ciclo." : "O grafo não contém ciclo.",
    verificarBipartido(grafo)
      ? "O grafo é bipartido."
      : "O grafo não é bipartido.",
    `--------------------------------------------------------------------------------------------`,

    contemCaminhoFechado
      ? "O grafo contém caminho fechado."
      : "O grafo não contém caminho fechado.",

    verificarEuleriano(grafo)
      ? "O grafo é Euleriano."
      : "O grafo não é Euleriano.",
    `--------------------------------------------------------------------------------------------`,
  ];

  // Exibe os detalhes na interface como uma lista de elementos HTML
  detalhes.forEach((detalhe) => {
    const item = document.createElement("li");
    item.textContent = detalhe;
    listaResultados.appendChild(item);
  });

  // Torna o painel de resultados visível
  resultado.style.display = "block";

  // Visualiza o grafo utilizando a biblioteca Vis.js
  const nodes = new vis.DataSet();
  const arestasVis = new vis.DataSet();

  const vertices = new Set();

  // Extrai todos os vértices do grafo a partir das arestas
  arestas.forEach(([v1, v2]) => {
    vertices.add(v1);
    vertices.add(v2);
  });

  // Adiciona cada vértice como um nó na visualização
  vertices.forEach((vertex) => {
    nodes.add({ id: vertex, label: String(vertex) });
  });

  // Adiciona as arestas à visualização do grafo
  arestas.forEach(([v1, v2]) => {
    arestasVis.add({ from: v1, to: v2 });
  });

  // Configurações da visualização do grafo
  const container = visualizacaoGrafo;
  const data = { nodes: nodes, edges: arestasVis };
  const options = {
    width: "100%",
    height: "100%",
    physics: {
      enabled: true,
    },
  };

  // Cria e exibe o grafo com Vis.js
  new vis.Network(container, data, options);
}

// Função para converter a entrada de texto em um array de arestas
export function processarArestas(input) {
  try {
    // Tenta converter a entrada para um array JSON
    const analisado = JSON.parse(input);

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
      return analisado; // Retorna o array de arestas se for válido
    }

    return null; // Retorna null para entradas inválidas
  } catch (e) {
    return null; // Retorna null se houver erro ao analisar o JSON
  }
}

// Função para criar um grafo como objeto a partir das arestas fornecidas
export function criarGrafo(arestas) {
  const grafo = {}; // Objeto vazio para representar o grafo

  // Adiciona cada aresta ao grafo
  arestas.forEach(([u, v]) => {
    if (!grafo[u]) grafo[u] = [];
    if (!grafo[v]) grafo[v] = [];

    // Evita adicionar arestas duplicadas
    if (!grafo[u].includes(v)) grafo[u].push(v);
    if (!grafo[v].includes(u)) grafo[v].push(u); // Grafo não direcionado
  });

  return grafo;
}

// Função para contar o número de componentes conexos do grafo
export function contarComponentesConexos(grafo) {
  const visitado = new Set(); // Conjunto para armazenar os vértices visitados
  let componentesConexos = 0; // Contador de componentes conexos

  for (const nodo in grafo) {
    if (!visitado.has(Number(nodo))) {
      buscaProfundidade(grafo, Number(nodo), visitado); // Marca todos os vértices conectados
      componentesConexos++; // Incrementa o número de componentes conexos
    }
  }
  return componentesConexos;
}

// Função auxiliar para realizar busca em profundidade (DFS)
function buscaProfundidade(grafo, nodo, visitado) {
  if (!grafo[nodo]) return; // Se o nó não estiver no grafo, retorna

  visitado.add(nodo); // Marca o nó como visitado

  // Visita recursivamente os vizinhos que ainda não foram visitados
  grafo[nodo].forEach((v) => {
    if (!visitado.has(v)) {
      buscaProfundidade(grafo, v, visitado);
    }
  });
}

// Função para verificar se o grafo é completo
export function verificarCompleto(grafo) {
  const vertices = Object.keys(grafo); // Obtém os vértices do grafo
  const n = vertices.length; // Número de vértices no grafo

  // Verifica se cada vértice está conectado a todos os outros
  for (const vertice of vertices) {
    if (grafo[vertice].length !== n - 1) {
      return false; // Se algum vértice não estiver conectado a todos, não é completo
    }
  }
  return true;
}

// Função para verificar se o grafo contém ciclos (gerais, incluindo ciclos isolados)
export function verificarGrafoCiclo(grafo) {
  const visitado = new Set(); // Conjunto para armazenar os vértices visitados

  // Função auxiliar para verificar ciclos usando a busca em profundidade (DFS)
  function buscaCiclo(grafo, nodo, visitado, anterior) {
    visitado.add(nodo); // Marca o vértice atual como visitado

    // Itera sobre todos os vizinhos do vértice atual
    for (const vizinho of grafo[nodo]) {
      // Verifica se o vizinho é o vértice anterior (para evitar retroceder no caminho)
      if (vizinho !== anterior) {
        if (visitado.has(vizinho)) {
          return true; // Se o vizinho já foi visitado, um ciclo foi encontrado
        }
        // Caso contrário, continua a busca recursiva
        if (buscaCiclo(grafo, vizinho, visitado, nodo)) {
          return true;
        }
      }
    }

    return false; // Se nenhum ciclo for encontrado, retorna false
  }

  // Verifica se algum componente do grafo contém ciclo
  for (const nodo in grafo) {
    if (!visitado.has(Number(nodo))) {
      if (buscaCiclo(grafo, Number(nodo), visitado, -1)) {
        return true; // Se qualquer componente contém ciclo, retorna verdadeiro
      }
    }
  }

  return false; // Se nenhum ciclo foi encontrado
}

// Função para verificar se o grafo é bipartido
export function verificarBipartido(grafo) {
  const color = {}; // Objeto que armazena as cores atribuídas aos vértices

  // Percorre todos os nós do grafo para garantir que todos os componentes sejam verificados
  for (const nodo in grafo) {
    // Se o nó ainda não foi colorido, inicia a coloração a partir dele
    if (!(nodo in color)) {
      // Se não for possível colorir de maneira bipartida, retorna false
      if (!buscaProfundidadeBipartido(grafo, nodo, color, 0)) {
        return false;
      }
    }
  }
  return true; // Se todos os componentes puderem ser coloridos corretamente, o grafo é bipartido
}

// Função auxiliar para realizar a busca em profundidade (DFS) e tentar bipartir o grafo
function buscaProfundidadeBipartido(grafo, nodo, color, c) {
  // Se o nó não existir no grafo (não tem vizinhos), consideramos que ele não gera conflito
  if (!(nodo in grafo)) {
    return true;
  }

  // Se o nó já foi colorido, verifica se a cor atribuída é a esperada
  if (nodo in color) {
    return color[nodo] === c; // Retorna verdadeiro se a cor estiver correta, falso caso contrário
  }

  // Atribui a cor atual ao nó
  color[nodo] = c;

  // Itera sobre os vizinhos do nó
  for (const vizinho of grafo[nodo]) {
    // Faz uma chamada recursiva para tentar colorir os vizinhos com a cor oposta (1 - c)
    if (!buscaProfundidadeBipartido(grafo, vizinho, color, 1 - c)) {
      return false; // Se houver um conflito de cores, o grafo não pode ser bipartido
    }
  }

  return true; // Se todos os vizinhos foram coloridos corretamente, retorna verdadeiro
}

// Função para verificar se existe um caminho fechado no grafo
export function verificarCaminhoFechado(grafo) {
  const visitado = new Set(); // Conjunto para armazenar os vértices visitados

  // Itera sobre todos os vértices do grafo
  for (const nodo in grafo) {
    if (!visitado.has(Number(nodo))) {
      // Se o vértice não foi visitado, tenta encontrar um ciclo a partir dele
      if (buscaCiclo(grafo, nodo, visitado, -1)) {
        return true; // Se encontrar um ciclo, retorna true
      }
    }
  }

  return false; // Se nenhum ciclo for encontrado, retorna false
}

// Função auxiliar para realizar a busca em profundidade e verificar ciclos
function buscaCiclo(grafo, nodo, visitado, anterior) {
  visitado.add(nodo); // Marca o vértice atual como visitado

  // Itera sobre todos os vizinhos do vértice atual
  for (const vizinho of grafo[nodo]) {
    // Verifica se o vizinho é o vértice anterior (para evitar retroceder no caminho)
    if (vizinho !== anterior) {
      if (visitado.has(vizinho)) {
        return true; // Se o vizinho já foi visitado, um ciclo foi encontrado
      }
      // Caso contrário, continua a busca recursiva
      if (buscaCiclo(grafo, vizinho, visitado, nodo)) {
        return true;
      }
    }
  }

  return false; // Se nenhum ciclo for encontrado, retorna false
}

// Função para verificar se o grafo é Euleriano
export function verificarEuleriano(grafo) {
  const vertices = Object.keys(grafo); // Obtém todos os vértices do grafo

  // Verifica se todos os vértices têm grau par
  for (const vertice of vertices) {
    if (grafo[vertice].length % 2 !== 0) {
      return false; // Se algum vértice tiver grau ímpar, não é Euleriano
    }
  }

  // Verifica se o grafo é conexo
  // Um grafo com grau par em todos os vértices e não conexo não pode ter um circuito Euleriano
  const componentesConexos = contarComponentesConexos(grafo);
  if (componentesConexos !== 1) {
    return false; // Se o grafo não for conexo, não tem circuito Euleriano
  }

  return true; // Se todas as condições forem atendidas, o grafo é Euleriano
}

// Vincula a função de verificação ao botão da interface
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("button").addEventListener("click", verificarGrafo);
  });
}
