const listaTrilhas = document.getElementById("listaTrilhas");
const formTrilha = document.getElementById("formTrilha");
const msg = document.getElementById("msg");

function mostrarMsg(texto) {
    msg.textContent = texto;
    msg.style.display = texto ? "block" : "none";
}

function mostrarTrilhas() {
    const trilhas = lerTrilhas();
    listaTrilhas.innerHTML = "";

    if (trilhas.length === 0) {
        const p = document.createElement("p");
        p.className = "vazio";
        p.textContent = "Você ainda não criou nenhuma trilha.";
        listaTrilhas.appendChild(p);
        return;
    }

    trilhas.slice().reverse().forEach(function (t) {
        const itens = t.conteudos.filter(function (c) { return c && typeof c === "object" && c.href; });

        const box = document.createElement("div");
        box.className = "trilha";

        const titulo = document.createElement("h2");
        titulo.textContent = t.nome + " (" + itens.length + " conteúdos)";
        box.appendChild(titulo);

        const btnAdd = document.createElement("button");
        btnAdd.textContent = "+ Adicionar conteúdo";
        btnAdd.addEventListener("click", function () {
            window.location.href = "Content.html?trilha=" + t.id;
        });
        box.appendChild(btnAdd);

        if (itens.length === 0) {
            const vazio = document.createElement("p");
            vazio.className = "vazio";
            vazio.textContent = "Trilha vazia. Clique em \"+ Adicionar conteúdo\".";
            box.appendChild(vazio);
        } else {
            const ul = document.createElement("ul");
            itens.forEach(function (c) {
                const li = document.createElement("li");

                const a = document.createElement("a");
                a.href = c.href;
                a.textContent = c.titulo;
                li.appendChild(a);

                const partes = (c.caminho || "").split(" > ");
                if (partes[0]) {
                    const tag = document.createElement("span");
                    tag.className = "tag";
                    tag.textContent = partes[0];
                    li.appendChild(tag);
                }
                if (partes.length > 1) {
                    const resto = document.createElement("small");
                    resto.textContent = partes.slice(1).join(" > ");
                    li.appendChild(resto);
                }

                const x = document.createElement("button");
                x.className = "btn-x";
                x.title = "Remover da trilha";
                x.textContent = "✕";
                x.addEventListener("click", function () {
                    removerConteudo(t.id, c.href);
                    mostrarTrilhas();
                });
                li.appendChild(x);

                ul.appendChild(li);
            });
            box.appendChild(ul);
        }
        listaTrilhas.appendChild(box);
    });
}

formTrilha.addEventListener("submit", function (e) {
    e.preventDefault();
    const r = criarTrilha(document.getElementById("nomeTrilha").value);
    mostrarMsg(r.msg);
    if (r.ok) {
        formTrilha.reset();
        mostrarTrilhas();
    }
});

mostrarTrilhas();
