// data/eventos.js: categorias e eventos de EXEMPLO (não é agenda real).
// poster: a, b, c ou d (ilustrações geométricas). Troque por <img> quando tiver as artes.
const categorias = [
  { id: "teatro", nome: "Teatros", icone: "drama", cor: "rose" },
  { id: "standup", nome: "Stand-up", icone: "mic", cor: "violet" },
  { id: "livros", nome: "Livros", icone: "book", cor: "green" },
  { id: "esportes", nome: "Esportes", icone: "soccer", cor: "amber" },
  { id: "shows", nome: "Shows", icone: "music", cor: "blue" },
  { id: "infantil", nome: "Infantil", icone: "sparkles", cor: "pink" },
  { id: "exposicoes", nome: "Exposições", icone: "ticket", cor: "green" },
];

const eventos = [
  {
    id: 1, titulo: "Arte Brasileira: Quadro a Quadro", categoria: "exposicoes",
    local: "Região da Av. Paulista, São Paulo", quando: "Fins de semana", pontos: 150, poster: "a",
    resumo: "Um passeio pela história da pintura brasileira.",
    descricao: "Exposição de exemplo que reúne obras de diferentes períodos da arte brasileira, com visitas guiadas e espaço para conversa com o público.",
  },
  {
    id: 2, titulo: "O palco é todo seu", categoria: "teatro",
    local: "Centro, São Paulo", quando: "Sextas e sábados, 20h", pontos: 200, poster: "b",
    resumo: "Teatro com histórias feitas para emocionar.",
    descricao: "Espetáculo de exemplo com elenco local. Na versão final, esta página mostrará sessões, valores e o botão de compra.",
  },
  {
    id: 3, titulo: "Som que conecta", categoria: "shows",
    local: "Zona Oeste, São Paulo", quando: "Sábados, 19h", pontos: 250, poster: "c",
    resumo: "Música ao vivo com artistas da cena paulistana.",
    descricao: "Show de exemplo com repertório variado, de MPB a música eletrônica, reunindo artistas independentes da cidade.",
  },
  {
    id: 4, titulo: "Entre páginas e encontros", categoria: "livros",
    local: "Vila Madalena, São Paulo", quando: "Domingos, 15h", pontos: 100, poster: "d",
    resumo: "Clube de leitura aberto ao público.",
    descricao: "Encontro de exemplo para quem gosta de ler e trocar ideias, com sorteio de livros e lançamento de autores.",
  },
  {
    id: 5, titulo: "Noite de riso", categoria: "standup",
    local: "Pinheiros, São Paulo", quando: "Quintas, 21h", pontos: 180, poster: "b",
    resumo: "Stand-up com humoristas da cidade.",
    descricao: "Noite de comédia de exemplo, com vários comediantes se revezando no palco em apresentações curtas.",
  },
  {
    id: 6, titulo: "Domingo no parque", categoria: "infantil",
    local: "Parque do Ibirapuera, São Paulo", quando: "Domingos, 10h", pontos: 120, poster: "a",
    resumo: "Oficinas e brincadeiras para toda a família.",
    descricao: "Programação infantil de exemplo com contação de histórias, pintura e jogos ao ar livre.",
  },
  {
    id: 7, titulo: "Corrida cultural", categoria: "esportes",
    local: "Zona Sul, São Paulo", quando: "Primeiro sábado do mês, 7h", pontos: 160, poster: "d",
    resumo: "Percurso pela cidade passando por pontos históricos.",
    descricao: "Evento esportivo de exemplo que une atividade física e cultura, com paradas em locais históricos.",
  },
  {
    id: 8, titulo: "Cinema sob as estrelas", categoria: "exposicoes",
    local: "Zona Leste, São Paulo", quando: "Última sexta do mês, 19h30", pontos: 140, poster: "c",
    resumo: "Sessão de cinema ao ar livre.",
    descricao: "Exibição de exemplo de filmes nacionais em telão ao ar livre, com debate ao final.",
  },
];

// Junta o nome da categoria em cada evento (usado nas views)
const comCategoria = (e) => {
  const c = categorias.find((x) => x.id === e.categoria);
  return { ...e, categoriaNome: c ? c.nome : "", categoriaCor: c ? c.cor : "green" };
};

module.exports = {
  categorias,
  eventos: eventos.map(comCategoria),
};
