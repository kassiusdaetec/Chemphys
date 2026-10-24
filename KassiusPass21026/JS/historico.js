const lista = document.getElementById("listaHistorico");
const btnLimpar = document.getElementById("btnLimpar");

function criarInfo(texto) {
    const s = document.createElement("small");
    s.className = "data-hist";
    s.textContent = texto;
    return s;
}

function formatarData(iso) {
    return new Date(iso).toLocaleString("pt-BR");
}

function criarCardHistoricoConteudo(h) {
    const item = document.createElement("div");
    item.className = "item-hist";

    const card = document.createElement("div");
    card.className = "card";
    card.style.cursor = "pointer";

    if (h.imagem) {
        const img = document.createElement("img");
        img.src = h.imagem;
        card.appendChild(img);
    }

    const p = document.createElement("p");
    p.textContent = h.titulo;
    card.appendChild(p);

    const a = document.createElement("a");
    a.href = h.href;
    a.textContent = "Fazer Componente";
    card.appendChild(a);

    card.addEventListener("click", function (e) {
        if (e.target.closest("a")) return;
        window.location.href = h.href;
    });

    item.appendChild(card);
    if (h.caminho) item.appendChild(criarInfo(h.caminho));
    item.appendChild(criarInfo(formatarData(h.data)));
    return item;
}

function criarCardCalculo(h) {
    const item = document.createElement("div");
    item.className = "item-hist";

    const secao = document.createElement("section");
    secao.className = "calculadora";

    const h2 = document.createElement("h2");
    h2.textContent = h.titulo;
    secao.appendChild(h2);

    const formula = document.createElement("p");
    formula.className = "formula";
    formula.textContent = h.formula;
    secao.appendChild(formula);

    const corpo = document.createElement("div");
    corpo.className = "form-calculo";

    (h.campos || []).forEach(function (campo) {
        const label = document.createElement("label");
        label.appendChild(document.createTextNode(campo.rotulo));

        const input = document.createElement("input");
        input.type = "text";
        input.value = campo.valor;
        input.readOnly = true;
        input.tabIndex = -1;
        label.appendChild(input);

        corpo.appendChild(label);
    });

    const resultado = document.createElement("p");
    resultado.className = "resultado";
    resultado.textContent = "Resultado: " + h.resultado + " | " + h.formula;
    corpo.appendChild(resultado);

    secao.appendChild(corpo);
    item.appendChild(secao);
    item.appendChild(criarInfo(formatarData(h.data)));
    return item;
}

function mostrarHistorico() {
    lista.innerHTML = "";
    let total = 0;

    lerHistorico().forEach(function (h) {
        if (h.tipo === "calculo") {
            lista.appendChild(criarCardCalculo(h));
            total++;
        } else if (h.href) {
            lista.appendChild(criarCardHistoricoConteudo(h));
            total++;
        }
    });

    btnLimpar.style.display = total ? "inline-block" : "none";

    if (total === 0) {
        const p = document.createElement("p");
        p.className = "vazio";
        p.textContent = "Nada por aqui ainda. Abra um conteúdo ou faça um cálculo.";
        lista.appendChild(p);
    }
}

btnLimpar.addEventListener("click", function () {
    if (confirm("Apagar todo o histórico?")) {
        limparHistorico();
        mostrarHistorico();
    }
});

mostrarHistorico();
