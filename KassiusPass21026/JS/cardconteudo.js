function criarCardConteudo(c) {
    const card = document.createElement("div");
    card.className = "card";
    card.style.cursor = "pointer";

    if (c.imagem) {
        const img = document.createElement("img");
        img.src = c.imagem;
        img.alt = c.titulo;
        img.loading = "lazy";
        img.style.width = "100%";
        img.style.height = "140px";
        img.style.objectFit = "cover";
        img.style.borderRadius = "8px";
        img.style.marginBottom = "10px";
        img.addEventListener("error", function () { img.style.display = "none"; });
        card.appendChild(img);
    }

    const h3 = document.createElement("h3");
    h3.textContent = c.titulo;
    card.appendChild(h3);

    const t1 = document.createElement("span");
    t1.className = "tag";
    t1.textContent = c.materia;
    card.appendChild(t1);

    const t2 = document.createElement("span");
    t2.className = "tag";
    t2.textContent = c.assunto;
    card.appendChild(t2);

    const p = document.createElement("p");
    p.textContent = c.texto.length > 120 ? c.texto.slice(0, 120) + "..." : c.texto;
    card.appendChild(p);

    return card;
}
