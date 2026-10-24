const CONTEUDOS = [
    {
        id: 1,
        titulo: "Velocidade média",
        materia: "Física",
        assunto: "Cinemática",
        texto: "Velocidade média é a razão entre a distância percorrida e o tempo gasto.",
        link: ""
    },
    {
        id: 2,
        titulo: "Leis de Newton",
        materia: "Física",
        assunto: "Dinâmica",
        texto: "As três leis que descrevem a relação entre força e movimento.",
        link: ""
    },
    {
        id: 3,
        titulo: "Tabela periódica",
        materia: "Química",
        assunto: "Estrutura atômica",
        texto: "Organização dos elementos químicos por número atômico.",
        link: ""
    },
    {
        id: 4,
        titulo: "Ligações químicas",
        materia: "Química",
        assunto: "Ligações",
        texto: "Ligações iônicas, covalentes e metálicas.",
        link: ""
    }
];

function buscarConteudo(id) {
    return CONTEUDOS.find(function (c) { return c.id === id; });
}

function caminhoDoConteudo(c) {
    return c.link ? c.link : linkDoConteudo(c.id);
}