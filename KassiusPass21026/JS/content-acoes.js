
(function () {
    function limpar(texto) {
        return (texto || "").replace(/\s+/g, " ").trim();
    }

    function caminhoDoCard(card) {
        const partes = [];
        let el = card.parentElement;
        while (el) {
            if (el.tagName === "DETAILS") {
                const resumo = el.querySelector(":scope > summary");
                if (resumo) partes.unshift(limpar(resumo.textContent.replace(/›/g, "")));
            }
            el = el.parentElement;
        }
        return partes.join(" > ");
    }

    function lerCard(card) {
        const link = card.querySelector("a");
        const img = card.querySelector("img");
        const p = card.querySelector("p");
        return {
            href: link.getAttribute("href"),
            titulo: limpar(p ? p.textContent : link.textContent),
            imagem: img ? img.getAttribute("src") : "",
            caminho: caminhoDoCard(card)
        };
    }

    const idTrilha = Number(new URLSearchParams(window.location.search).get("trilha"));
    const trilha = idTrilha
        ? lerTrilhas().find(function (t) { return t.id === idTrilha; })
        : null;

    const area = document.querySelector(".content");
    let aviso = null;

    function mostrarAviso(texto, comLinkVoltar) {
        if (!aviso) {
            aviso = document.createElement("div");
            aviso.style.cssText = "margin:10px 20px;padding:10px 14px;border-radius:6px;background:#e1f0ff;color:#00021a;";
            area.insertBefore(aviso, area.firstChild);
        }
        aviso.textContent = texto + " ";
        if (comLinkVoltar) {
            const voltar = document.createElement("a");
            voltar.href = "courses.html";
            voltar.textContent = "← Voltar para as trilhas";
            aviso.appendChild(voltar);
        }
        aviso.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    if (idTrilha && !trilha) {
        mostrarAviso("Trilha não encontrada.", true);
    }

    if (trilha) {
        mostrarAviso("Escolha um conteúdo para adicionar à trilha \"" + trilha.nome + "\": abra a matéria e clique no card.", true);
        document.querySelectorAll(".card").forEach(function (card) {
            if (!card.querySelector("a")) return;
            card.style.cursor = "pointer";
            if (conteudoEstaNaTrilha(trilha, lerCard(card).href)) {
                card.style.opacity = "0.5";
                card.title = "Já está na trilha";
            }
        });
    }

    if (!trilha) {
        document.querySelectorAll(".card").forEach(function (card) {
            if (!card.querySelector("a")) return;

            const botao = document.createElement("button");
            botao.type = "button";
            botao.style.cssText = ESTILO_BOTAO_FAVORITO;
            aparenciaBotaoFavorito(botao, ehFavorito(lerCard(card).href));

            botao.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                try {
                    aparenciaBotaoFavorito(botao, alternarFavorito(lerCard(card)));
                } catch (erro) {
                    alert("Não foi possível salvar o favorito. O navegador pode estar bloqueando o armazenamento do site.");
                }
            });

            card.style.position = "relative"; 
            card.appendChild(botao);
        });
    }

    document.addEventListener("click", function (e) {
        const card = e.target.closest(".card");
        if (!card || !card.querySelector("a")) return;

        if (trilha) {
            e.preventDefault();
            const r = adicionarConteudo(trilha.id, lerCard(card));
            if (r.ok) {
                window.location.href = "courses.html";
            } else {
                mostrarAviso(r.msg, true);
            }
            return;
        }

        if (e.target.closest("a")) {
            try {
                registrarHistorico(lerCard(card));
            } catch (erro) {
            }
        }
    });
})();
