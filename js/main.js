/* ============================================================
   JAVASCRIPT | P1-C
   Seletor de idioma PT/EN.

   Como funciona: qualquer elemento com os atributos data-pt e
   data-en no HTML e traduzivel. O texto visivel por defeito e
   o PT (escrito diretamente no HTML, funciona mesmo sem JS).
   Ao clicar em PT ou EN, percorre-se todos esses elementos e
   troca-se o texto pelo atributo correspondente.

   A escolha fica guardada no localStorage do browser, para se
   manter ao navegar entre ancoras ou voltar ao site depois.
   ============================================================ */

const CHAVE_IDIOMA = "portfolio-idioma";

function aplicarIdioma(idioma) {
  // Troca o texto de todos os elementos marcados como traduziveis
  document.querySelectorAll("[data-pt][data-en]").forEach((elemento) => {
    elemento.textContent = elemento.dataset[idioma];
  });

  // Atualiza o atributo lang do HTML (acessibilidade e SEO)
  document.documentElement.lang = idioma;

  // Marca visualmente qual botao esta ativo
  document.querySelectorAll("[data-lang-btn]").forEach((botao) => {
    botao.classList.toggle("ativo", botao.dataset.langBtn === idioma);
  });

  localStorage.setItem(CHAVE_IDIOMA, idioma);
}

// Liga o clique de cada botao de idioma
document.querySelectorAll("[data-lang-btn]").forEach((botao) => {
  botao.addEventListener("click", () => aplicarIdioma(botao.dataset.langBtn));
});

// Ao carregar a pagina: usa o idioma guardado, ou PT por defeito
const idiomaGuardado = localStorage.getItem(CHAVE_IDIOMA) || "pt";
aplicarIdioma(idiomaGuardado);

/* ============================================================
   RENDERIZADOR DE PROJETOS | P2-B
   Carrega dados/projetos.json e renderiza na grade.
   ============================================================ */

async function carregarEExibirProjetos() {
  try {
    const resposta = await fetch("dados/projetos-produzidos.json");
    const dados = await resposta.json();

    const gradeElement = document.getElementById("grade-projetos");
    if (!gradeElement) return;

    const idiomaAtual = localStorage.getItem(CHAVE_IDIOMA) || "pt";

    dados.projetos.forEach((projeto) => {
      const card = document.createElement("div");
      card.className = "projeto-card";

      const isDisciplinasArray = Array.isArray(projeto.disciplinas_pt);
      const disciplinasTexto = isDisciplinasArray
        ? (idiomaAtual === "pt"
          ? projeto.disciplinas_pt.join(", ")
          : projeto.disciplinas_en.join(", "))
        : (idiomaAtual === "pt" ? projeto.disciplinas_pt : projeto.disciplinas_en);

      const areaTexto = projeto.area_m2 ? `${projeto.area_m2.toLocaleString("pt-PT")} m²` : "—";

      const disciplinasPt = Array.isArray(projeto.disciplinas_pt) ? projeto.disciplinas_pt.join(", ") : projeto.disciplinas_pt;
      const disciplinasEn = Array.isArray(projeto.disciplinas_en) ? projeto.disciplinas_en.join(", ") : projeto.disciplinas_en;

      card.innerHTML = `
        <h3 data-pt="${projeto.nome_pt}" data-en="${projeto.nome_en}">${projeto.nome_pt}</h3>
        <div class="projeto-meta">
          <p><strong data-pt="Localização:" data-en="Location:">Localização:</strong> ${projeto.localizacao}</p>
          <p><strong data-pt="Tipologia:" data-en="Typology:">Tipologia:</strong> <span data-pt="${projeto.tipologia_pt}" data-en="${projeto.tipologia_en}">${projeto.tipologia_pt}</span></p>
          <p><strong data-pt="Disciplinas:" data-en="Disciplines:">Disciplinas:</strong> <span data-pt="${disciplinasPt}" data-en="${disciplinasEn}">${disciplinasPt}</span></p>
          ${projeto.area_m2 ? `<p><strong data-pt="Área:" data-en="Area:">Área:</strong> ${areaTexto}</p>` : ""}
        </div>
        <p class="projeto-descricao" data-pt="${projeto.descricao_pt}" data-en="${projeto.descricao_en}">${projeto.descricao_pt}</p>
      `;

      gradeElement.appendChild(card);
    });

    // Reaplicar idioma para os elementos recém-renderizados
    aplicarIdioma(idiomaAtual);

  } catch (erro) {
    console.error("Erro ao carregar projetos:", erro);
  }
}

/* ============================================================
   RENDERIZADOR DE PROJETOS COORDENADOS | P2-C
   Carrega dados/projetos-coordenados.json: destaques com nome,
   fichas anonimizadas (vazio por agora) e numeros da Futuro
   Engenharia.
   ============================================================ */

async function carregarEExibirCoordenados() {
  try {
    const resposta = await fetch("dados/projetos-coordenados.json");
    const dados = await resposta.json();

    const idiomaAtual = localStorage.getItem(CHAVE_IDIOMA) || "pt";

    // Destaques com nome (ja publicos no CV/LinkedIn)
    const gradeElement = document.getElementById("grade-coordenados");
    if (gradeElement) {
      dados.destaques.forEach((projeto) => {
        const card = document.createElement("div");
        card.className = "projeto-card";

        const disciplinasPt = projeto.disciplinas_pt.join(", ");
        const disciplinasEn = projeto.disciplinas_en.join(", ");

        card.innerHTML = `
          <h3 data-pt="${projeto.nome_pt}" data-en="${projeto.nome_en}">${projeto.nome_pt}</h3>
          <div class="projeto-meta">
            ${projeto.localizacao ? `<p><strong data-pt="Localização:" data-en="Location:">Localização:</strong> ${projeto.localizacao}</p>` : ""}
            <p><strong data-pt="Tipologia:" data-en="Typology:">Tipologia:</strong> <span data-pt="${projeto.tipologia_pt}" data-en="${projeto.tipologia_en}">${projeto.tipologia_pt}</span></p>
            ${projeto.capacidade ? `<p><strong data-pt="Capacidade:" data-en="Scale:">Capacidade:</strong> <span data-pt="${projeto.capacidade}" data-en="${projeto.capacidade_en}">${projeto.capacidade}</span></p>` : ""}
            <p><strong data-pt="Papel:" data-en="Role:">Papel:</strong> <span data-pt="${projeto.papel_pt}" data-en="${projeto.papel_en}">${projeto.papel_pt}</span></p>
            <p><strong data-pt="Disciplinas:" data-en="Disciplines:">Disciplinas:</strong> <span data-pt="${disciplinasPt}" data-en="${disciplinasEn}">${disciplinasPt}</span></p>
          </div>
          <p class="projeto-descricao" data-pt="${projeto.descricao_pt}" data-en="${projeto.descricao_en}">${projeto.descricao_pt}</p>
        `;

        gradeElement.appendChild(card);
      });
    }

    // Bloco Futuro Engenharia: titulo, intro e estatisticas
    const tituloElement = document.getElementById("futuro-engenharia-titulo");
    if (tituloElement) {
      tituloElement.dataset.pt = dados.futuro_engenharia.titulo_pt;
      tituloElement.dataset.en = dados.futuro_engenharia.titulo_en;
      tituloElement.textContent = dados.futuro_engenharia.titulo_pt;
    }

    const introElement = document.getElementById("futuro-engenharia-intro");
    if (introElement) {
      introElement.dataset.pt = dados.futuro_engenharia.intro_pt;
      introElement.dataset.en = dados.futuro_engenharia.intro_en;
      introElement.textContent = dados.futuro_engenharia.intro_pt;
    }

    const estatisticasElement = document.getElementById("lista-estatisticas");
    if (estatisticasElement) {
      dados.futuro_engenharia.estatisticas.forEach((item) => {
        const bloco = document.createElement("div");
        bloco.className = "estatistica-item";
        bloco.innerHTML = `
          <span class="estatistica-valor">${item.valor}</span>
          <span class="estatistica-rotulo" data-pt="${item.rotulo_pt}" data-en="${item.rotulo_en}">${item.rotulo_pt}</span>
        `;
        estatisticasElement.appendChild(bloco);
      });
    }

    // Reaplicar idioma para os elementos recem-renderizados
    aplicarIdioma(idiomaAtual);

  } catch (erro) {
    console.error("Erro ao carregar projetos coordenados:", erro);
  }
}

// Ao carregar a pagina, renderizar projetos
document.addEventListener("DOMContentLoaded", carregarEExibirProjetos);
document.addEventListener("DOMContentLoaded", carregarEExibirCoordenados);

console.log("Portfolio Web: JS carregado. Navegacao, seletor de idioma P1-C, renderizador de projetos P2-B e projetos coordenados P2-C.");
