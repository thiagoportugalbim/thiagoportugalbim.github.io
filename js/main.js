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

console.log("Portfolio Web: JS carregado. Navegacao e seletor de idioma P1-C.");
