const CHAVE_TRILHAS = "chemphys_trilhas";
const CHAVE_HISTORICO = "chemphys_historico";
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
