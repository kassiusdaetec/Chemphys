const lista = document.getElementById("listaFavoritos");

function criarInfo(texto) {
    const s = document.createElement("small");
    s.className = "info-fav";
    s.textContent = texto;
    return s;
}

function criarCardFavorito(f) {
    const item = document.createElement("div");
    item.className = "item-fav";

    const card = document.createElement("div");
    card.className = "card";
    card.style.cursor = "pointer";
    card.style.position = "relative";

    if (f.imagem) {
        const img = document.createElement("img");
        img.src = f.imagem;
        card.appendChild(img);
    }

    const p = document.createElement("p");
    p.textContent = f.titulo;
    card.appendChild(p);

    const a = document.createElement("a");
    a.href = f.href;
    a.textContent = "Fazer Componente";
    card.appendChild(a);

    const botao = document.createElement("button");
    botao.type = "button";
    botao.style.cssText = ESTILO_BOTAO_FAVORITO;
    aparenciaBotaoFavorito(botao, true);
    botao.addEventListener("click", function (e) {
        e.stopPropagation();
        removerFavorito(f.href);
        mostrarFavoritos();
    });
    card.appendChild(botao);

    card.addEventListener("click", function (e) {
        if (e.target.closest("a")) return;
        window.location.href = f.href;
    });

    item.appendChild(card);
    if (f.caminho) item.appendChild(criarInfo(f.caminho));
    return item;
}

function mostrarFavoritos() {
    lista.innerHTML = "";
    const favoritos = lerFavoritos().filter(function (f) { return f && f.href; });

    favoritos.forEach(function (f) {
        lista.appendChild(criarCardFavorito(f));
    });

    if (favoritos.length === 0) {
        const p = document.createElement("p");
        p.className = "vazio";
        p.textContent = "Você ainda não favoritou nenhum conteúdo. Clique na ☆ de um card em Conteúdo.";
        lista.appendChild(p);
    }
}

mostrarFavoritos();
