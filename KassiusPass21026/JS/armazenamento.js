const CHAVE_TRILHAS = "chemphys_trilhas";
const CHAVE_HISTORICO = "chemphys_historico";
const CHAVE_FAVORITOS = "chemphys_favoritos";
const LIMITE_HISTORICO = 100;


function lerTrilhas() {
    try {
        const dados = JSON.parse(localStorage.getItem(CHAVE_TRILHAS));
        return Array.isArray(dados) ? dados : [];
    } catch (e) {
        return [];
    }
}

function salvarTrilhas(trilhas) {
    localStorage.setItem(CHAVE_TRILHAS, JSON.stringify(trilhas));
}

function criarTrilha(nome) {
    nome = nome.trim();
    if (nome === "") {
        return { ok: false, msg: "Dê um nome para a trilha." };
    }
    const trilhas = lerTrilhas();
    const jaExiste = trilhas.some(function (t) {
        return t.nome.toLowerCase() === nome.toLowerCase();
    });
    if (jaExiste) {
        return { ok: false, msg: "Já existe uma trilha com esse nome." };
    }
    trilhas.push({ id: Date.now(), nome: nome, conteudos: [] });
    salvarTrilhas(trilhas);
    return { ok: true, msg: "Trilha criada!" };
}

function conteudoEstaNaTrilha(trilha, href) {
    return trilha.conteudos.some(function (c) { return c && c.href === href; });
}

function adicionarConteudo(idTrilha, conteudo) {
    const trilhas = lerTrilhas();
    const trilha = trilhas.find(function (t) { return t.id === idTrilha; });
    if (!trilha) {
        return { ok: false, msg: "Trilha não encontrada." };
    }
    if (conteudoEstaNaTrilha(trilha, conteudo.href)) {
        return { ok: false, msg: "Esse conteúdo já está nessa trilha." };
    }
    trilha.conteudos.push({
        href: conteudo.href,
        titulo: conteudo.titulo,
        imagem: conteudo.imagem,
        caminho: conteudo.caminho
    });
    salvarTrilhas(trilhas);
    return { ok: true, msg: "Conteúdo adicionado à trilha!" };
}

function removerConteudo(idTrilha, href) {
    const trilhas = lerTrilhas();
    const trilha = trilhas.find(function (t) { return t.id === idTrilha; });
    if (trilha) {
        trilha.conteudos = trilha.conteudos.filter(function (c) { return !(c && c.href === href); });
        salvarTrilhas(trilhas);
    }
}

function lerHistorico() {
    try {
        const dados = JSON.parse(localStorage.getItem(CHAVE_HISTORICO));
        return Array.isArray(dados) ? dados : [];
    } catch (e) {
        return [];
    }
}

function registrarHistorico(conteudo) {
    const historico = lerHistorico();
    historico.unshift({
        tipo: "conteudo",
        data: new Date().toISOString(),
        href: conteudo.href,
        titulo: conteudo.titulo,
        imagem: conteudo.imagem,
        caminho: conteudo.caminho
    });
    localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(historico.slice(0, LIMITE_HISTORICO)));
}

function limparHistorico() {
    localStorage.removeItem(CHAVE_HISTORICO);
}


function lerFavoritos() {
    try {
        const dados = JSON.parse(localStorage.getItem(CHAVE_FAVORITOS));
        return Array.isArray(dados) ? dados : [];
    } catch (e) {
        return [];
    }
}

function ehFavorito(href) {
    return lerFavoritos().some(function (f) { return f && f.href === href; });
}

function alternarFavorito(conteudo) {
    const favoritos = lerFavoritos();
    const existe = favoritos.some(function (f) { return f && f.href === conteudo.href; });
    let novos;
    if (existe) {
        novos = favoritos.filter(function (f) { return !(f && f.href === conteudo.href); });
    } else {
        novos = [{
            href: conteudo.href,
            titulo: conteudo.titulo,
            imagem: conteudo.imagem,
            caminho: conteudo.caminho,
            data: new Date().toISOString()
        }].concat(favoritos);
    }
    localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(novos));
    return !existe;
}

function removerFavorito(href) {
    const novos = lerFavoritos().filter(function (f) { return !(f && f.href === href); });
    localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(novos));
}

const ESTILO_BOTAO_FAVORITO =
    "position:absolute;top:8px;right:8px;width:32px;height:32px;padding:0;border:none;" +
    "border-radius:50%;background:rgba(255,255,255,0.92);box-shadow:0 1px 4px rgba(0,0,0,0.3);" +
    "font-size:20px;line-height:32px;cursor:pointer;z-index:2;";

function aparenciaBotaoFavorito(botao, ativo) {
    botao.textContent = ativo ? "★" : "☆";
    botao.style.color = ativo ? "#f5b301" : "#555";
    botao.title = ativo ? "Remover dos favoritos" : "Adicionar aos favoritos";
}
