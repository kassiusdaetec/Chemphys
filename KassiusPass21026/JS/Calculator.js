const formularios = document.querySelectorAll(".form-calculo");

formularios.forEach(function(formulario) {
    formulario.addEventListener("submit", function(evento) {
        evento.preventDefault();

        const dados = new FormData(formulario);
        const tipo = formulario.dataset.tipo;
        const resultado = formulario.querySelector(".resultado");

        let valor;
        let unidade;
        let formula;

        function numero(campo) {
            return Number(dados.get(campo));
        }

        function formatar(valor) {
            return valor.toLocaleString("pt-BR", {
                maximumFractionDigits: 6
            });
        }

        resultado.classList.remove("erro");

        switch (tipo) {
            case "densidade": {
                const massa = numero("massa");
                const volume = numero("volume");

                if (volume <= 0) {
                    mostrarErro("O volume deve ser maior que zero.");
                    return;
                }

                valor = massa / volume;
                unidade = "g/mL";
                formula = "d = m / V";
                break;
            }

            case "velocidade": {
                const distancia = numero("distancia");
                const tempo = numero("tempo");

                if (tempo <= 0) {
                    mostrarErro("O tempo deve ser maior que zero.");
                    return;
                }

                valor = distancia / tempo;
                unidade = "m/s";
                formula = "v = Δs / Δt";
                break;
            }

            case "forca": {
                const massa = numero("massa");
                const aceleracao = numero("aceleracao");

                valor = massa * aceleracao;
                unidade = "N";
                formula = "F = m · a";
                break;
            }

            case "peso": {
                const massa = numero("massa");
                const gravidade = numero("gravidade");

                valor = massa * gravidade;
                unidade = "N";
                formula = "P = m · g";
                break;
            }

            case "concentracao": {
                const massa = numero("massa");
                const volume = numero("volume");

                if (volume <= 0) {
                    mostrarErro("O volume deve ser maior que zero.");
                    return;
                }

                valor = massa / volume;
                unidade = "g/L";
                formula = "C = m / V";
                break;
            }

            case "mol": {
                const massa = numero("massa");
                const molar = numero("molar");

                if (molar <= 0) {
                    mostrarErro("A massa molar deve ser maior que zero.");
                    return;
                }

                valor = massa / molar;
                unidade = "mol";
                formula = "n = m / M";
                break;
            }

            default:
                mostrarErro("Calculadora não reconhecida.");
                return;
        }

        resultado.textContent =
            "Resultado: " + formatar(valor) + " " + unidade +
            " | " + formula;

        function mostrarErro(mensagem) {
            resultado.textContent = mensagem;
            resultado.classList.add("erro");
        }
    });
});
