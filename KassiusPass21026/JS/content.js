const cards = document.getElementById("cards");
const msg = document.getElementById("msg");

function mostrarMsg(texto) {
    msg.textContent = texto;
    msg.style.display = texto ? "block" : "none";
}

const idTrilhaUrl = Number(new URLSearchParams(window.location.search).get("trilha"));
const trilhaAlvo = idTrilhaUrl
    ? lerTrilhas().find(function (t) { return t.id === idTrilhaUrl; })
    : null;

if (idTrilhaUrl && !trilhaAlvo) {
    mostrarMsg("Trilha não encontrada. Volte para Trilhas e tente de novo.");
}

if (trilhaAlvo) {
    msg.textContent = "Clique em um conteúdo para adicioná-lo à trilha \"" + trilhaAlvo.nome + "\". ";
    const voltar = document.createElement("a");
    voltar.href = "courses.html";
    voltar.textContent = "← Voltar para as trilhas";
    msg.appendChild(voltar);
    msg.style.display = "block";
}

CONTEUDOS.forEach(function (c) {
    const card = criarCardConteudo(c);

    if (trilhaAlvo) {
        if (trilhaAlvo.conteudos.includes(c.id)) {
            card.style.opacity = "0.5";
            const ja = document.createElement("span");
            ja.className = "tag";
            ja.textContent = "Já está na trilha";
            card.appendChild(ja);
        }
        card.addEventListener("click", function () {
            const r = adicionarConteudo(trilhaAlvo.id, c.id);
            if (r.ok) {
                window.location.href = "courses.html";
            } else {
                mostrarMsg(r.msg);
            }
        });
    } else {
        card.addEventListener("click", function () {
            registrarHistorico(c.id);
            window.location.href = caminhoDoConteudo(c);
        });
    }

    cards.appendChild(card);
});
