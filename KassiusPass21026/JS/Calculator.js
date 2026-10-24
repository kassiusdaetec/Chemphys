const calculadoras = {
    densidade: {
        positivos: { volume: "O volume deve ser maior que zero." },
        calcular: (d) => d.massa / d.volume,
        unidade: "g/mL",
        formula: "d = m / V"
    },
    velocidade: {
        positivos: { tempo: "O tempo deve ser maior que zero." },
        calcular: (d) => d.distancia / d.tempo,
        unidade: "m/s",
        formula: "v = Δs / Δt"
    },
    forca: {
        calcular: (d) => d.massa * d.aceleracao,
        unidade: "N",
        formula: "F = m · a"
    },
    peso: {
        calcular: (d) => d.massa * d.gravidade,
        unidade: "N",
        formula: "P = m · g"
    },
    concentracao: {
        positivos: { volume: "O volume deve ser maior que zero." },
        calcular: (d) => d.massa / d.volume,
        unidade: "g/L",
        formula: "C = m / V"
    },
    mol: {
        positivos: { molar: "A massa molar deve ser maior que zero." },
        calcular: (d) => d.massa / d.molar,
        unidade: "mol",
        formula: "n = m / M"
    },
    energiacinetica: {
        calcular: (d) => d.massa * d.velocidade ** 2 / 2,
        unidade: "J",
        formula: "Ec = m · v² / 2"
    },
    trabalho: {
        calcular: (d) => d.forca * d.deslocamento,
        unidade: "J",
        formula: "τ = F · d"
    },
    potencia: {
        positivos: { tempo: "O tempo deve ser maior que zero." },
        calcular: (d) => d.trabalho / d.tempo,
        unidade: "W",
        formula: "P = τ / Δt"
    },
    pressao: {
        positivos: { area: "A área deve ser maior que zero." },
        calcular: (d) => d.forca / d.area,
        unidade: "Pa",
        formula: "p = F / A"
    },
    molaridade: {
        positivos: { volume: "O volume deve ser maior que zero." },
        calcular: (d) => d.mol / d.volume,
        unidade: "mol/L",
        formula: "M = n / V"
    },
    massamol: {
        calcular: (d) => d.mol * d.molar,
        unidade: "g",
        formula: "m = n · M"
    }
};

function formatar(valor) {
    return valor.toLocaleString("pt-BR", { maximumFractionDigits: 6 });
}

function mostrarErro(resultado, mensagem) {
    resultado.textContent = mensagem;
    resultado.classList.add("erro");
}

function lerCampos(formulario) {
    const dados = {};
    new FormData(formulario).forEach(function (valor, nome) {
        dados[nome] = Number(String(valor).replace(",", "."));
    });
    return dados;
}
const CHAVE_HISTORICO = "chemphys_historico";
const LIMITE_HISTORICO = 100;

function salvarCalculoNoHistorico(formulario, config, valor) {
    try {
        const secao = formulario.closest(".calculadora");

        const campos = [];
        formulario.querySelectorAll("label").forEach(function (label) {
            const input = label.querySelector("input");
            const copia = label.cloneNode(true);
            copia.querySelector("input").remove();
            campos.push({
                rotulo: copia.textContent.trim(),
                valor: input.value
            });
        });

        const entrada = {
            tipo: "calculo",
            data: new Date().toISOString(),
            titulo: secao.querySelector("h2").textContent.trim(),
            formula: config.formula,
            campos: campos,
            resultado: formatar(valor) + " " + config.unidade
        };

        let historico = [];
        try {
            const lido = JSON.parse(localStorage.getItem(CHAVE_HISTORICO));
            if (Array.isArray(lido)) historico = lido;
        } catch (e) { }

        historico.unshift(entrada);
        localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(historico.slice(0, LIMITE_HISTORICO)));
    } catch (e) {
    }
}

function calcular(evento) {
    evento.preventDefault();

    const formulario = evento.currentTarget;
    const resultado = formulario.querySelector(".resultado");
    const config = calculadoras[formulario.dataset.tipo];

    resultado.classList.remove("erro");

    if (!config) {
        mostrarErro(resultado, "Calculadora não reconhecida.");
        return;
    }

    const dados = lerCampos(formulario);

    for (const nome in dados) {
        if (!Number.isFinite(dados[nome])) {
            mostrarErro(resultado, "Preencha todos os campos com números válidos.");
            return;
        }
    }

    const positivos = config.positivos || {};
    for (const nome in positivos) {
        if (dados[nome] <= 0) {
            mostrarErro(resultado, positivos[nome]);
            return;
        }
    }

    const valor = config.calcular(dados);

    resultado.textContent =
        "Resultado: " + formatar(valor) + " " + config.unidade +
        " | " + config.formula;
    salvarCalculoNoHistorico(formulario, config, valor);
}

document.querySelectorAll(".form-calculo").forEach(function (formulario) {
    formulario.addEventListener("submit", calcular);
});
