/*
 * Seletor de compostos para as calculadoras que usam massa molar
 * (data-tipo="mol" e data-tipo="massamol").
 *
 * - Nomes em português ficam aqui no código.
 * - A massa molar vem da API PubChem (PUG REST), numa única requisição.
 * - Ao escolher um composto, o campo "Massa molar (g/mol)" é preenchido.
 *
 * Detalhes importantes para não quebrar o Calculator.js:
 *   1) o <select> NÃO tem atributo name (assim não entra no FormData);
 *   2) o bloco NÃO usa <label> (o Calculator.js lê todos os <label> do
 *      formulário para salvar o histórico e espera um <input> em cada um).
 */
(function () {
    const COMPOSTOS = [
        { nome: "Água", formula: "H2O", cid: 962 },
        { nome: "Dióxido de carbono", formula: "CO2", cid: 280 },
        { nome: "Oxigênio", formula: "O2", cid: 977 },
        { nome: "Hidrogênio", formula: "H2", cid: 783 },
        { nome: "Nitrogênio", formula: "N2", cid: 947 },
        { nome: "Amônia", formula: "NH3", cid: 222 },
        { nome: "Metano", formula: "CH4", cid: 297 },
        { nome: "Metanol", formula: "CH4O", cid: 887 },
        { nome: "Etanol", formula: "C2H6O", cid: 702 },
        { nome: "Glicose", formula: "C6H12O6", cid: 5793 },
        { nome: "Sacarose", formula: "C12H22O11", cid: 5988 },
        { nome: "Cloreto de sódio", formula: "NaCl", cid: 5234 },
        { nome: "Hidróxido de sódio", formula: "NaOH", cid: 14798 },
        { nome: "Bicarbonato de sódio", formula: "NaHCO3", cid: 516892 },
        { nome: "Carbonato de cálcio", formula: "CaCO3", cid: 10112 },
        { nome: "Ácido clorídrico", formula: "HCl", cid: 313 },
        { nome: "Ácido sulfúrico", formula: "H2SO4", cid: 1118 },
        { nome: "Ácido nítrico", formula: "HNO3", cid: 944 },
        { nome: "Ácido acético", formula: "C2H4O2", cid: 176 },
        { nome: "Peróxido de hidrogênio", formula: "H2O2", cid: 784 }
    ];

    const URL_API =
        "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/" +
        COMPOSTOS.map(function (c) { return c.cid; }).join(",") +
        "/property/MolecularFormula,MolecularWeight/JSON";

    const SUBSCRITOS = "₀₁₂₃₄₅₆₇₈₉";

    function subscrito(formula) {
        return formula.replace(/\d/g, function (d) { return SUBSCRITOS[d]; });
    }

    // A PubChem escreve as fórmulas na ordem de Hill (NaCl vira "ClNa"),
    // então comparamos a contagem de átomos, não o texto.
    function contarAtomos(formula) {
        const contagem = {};
        formula.replace(/([A-Z][a-z]?)(\d*)/g, function (_, elemento, n) {
            contagem[elemento] = (contagem[elemento] || 0) + (n ? Number(n) : 1);
            return "";
        });
        return contagem;
    }

    function mesmaFormula(a, b) {
        const x = contarAtomos(a);
        const y = contarAtomos(b);
        const chaves = Object.keys(x);
        return chaves.length === Object.keys(y).length &&
            chaves.every(function (k) { return x[k] === y[k]; });
    }

    function formatarMassa(valor) {
        return Number(valor).toLocaleString("pt-BR", { maximumFractionDigits: 3 });
    }

    let promessa = null;

    // Uma única requisição, reaproveitada pelas duas calculadoras.
    function obterCompostos() {
        if (!promessa) {
            promessa = fetch(URL_API)
                .then(function (resposta) {
                    if (!resposta.ok) throw new Error("Falha ao consultar a PubChem.");
                    return resposta.json();
                })
                .then(function (dados) {
                    const porCid = {};
                    dados.PropertyTable.Properties.forEach(function (p) {
                        porCid[p.CID] = p;
                    });

                    // Só entra na lista o composto cuja fórmula bate com a esperada.
                    return COMPOSTOS.filter(function (c) {
                        const p = porCid[c.cid];
                        return p && Number.isFinite(Number(p.MolecularWeight)) &&
                            mesmaFormula(c.formula, p.MolecularFormula);
                    }).map(function (c) {
                        return {
                            nome: c.nome,
                            formula: c.formula,
                            massa: Number(porCid[c.cid].MolecularWeight)
                        };
                    });
                });

            promessa.catch(function () { promessa = null; });
        }
        return promessa;
    }

    let contador = 0;

    function criarSeletor(formulario) {
        const inputMolar = formulario.querySelector('input[name="molar"]');
        if (!inputMolar) return;
        const labelMolar = inputMolar.closest("label");
        if (!labelMolar) return;

        contador++;
        const bloco = document.createElement("div");
        bloco.className = "seletor-composto";

        const titulo = document.createElement("span");
        titulo.className = "seletor-composto-titulo";
        titulo.id = "titulo-composto-" + contador;
        titulo.textContent = "Composto (preenche a massa molar)";

        const select = document.createElement("select");
        select.setAttribute("aria-labelledby", titulo.id);
        select.disabled = true;
        select.appendChild(new Option("Carregando compostos…", ""));

        const aviso = document.createElement("small");
        aviso.className = "seletor-composto-aviso";
        aviso.setAttribute("aria-live", "polite");

        bloco.appendChild(titulo);
        bloco.appendChild(select);
        bloco.appendChild(aviso);
        labelMolar.parentNode.insertBefore(bloco, labelMolar);

        obterCompostos().then(function (lista) {
            select.replaceChildren(new Option("Escolher um composto…", ""));
            lista.forEach(function (c) {
                const texto = c.nome + " (" + subscrito(c.formula) + ") — " +
                    formatarMassa(c.massa) + " g/mol";
                select.appendChild(new Option(texto, String(c.massa)));
            });
            select.disabled = lista.length === 0;
            if (lista.length === 0) {
                aviso.textContent = "Nenhum composto disponível. Digite a massa molar manualmente.";
            }
        }).catch(function () {
            select.replaceChildren(new Option("Lista indisponível", ""));
            aviso.textContent = "Não foi possível carregar os compostos. Digite a massa molar manualmente.";
        });

        select.addEventListener("change", function () {
            if (!select.value) {
                aviso.textContent = "";
                return;
            }
            inputMolar.value = select.value;
            inputMolar.dispatchEvent(new Event("input", { bubbles: true }));
            aviso.textContent = "Massa molar preenchida: " + formatarMassa(select.value) + " g/mol.";
        });

        // Se a pessoa editar o campo na mão, o select volta ao estado inicial.
        inputMolar.addEventListener("input", function () {
            if (inputMolar.value !== select.value) select.value = "";
        });
    }

    document
        .querySelectorAll('.form-calculo[data-tipo="mol"], .form-calculo[data-tipo="massamol"]')
        .forEach(criarSeletor);
})();
