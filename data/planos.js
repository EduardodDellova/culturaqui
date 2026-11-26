// data/planos.js: planos, tabela comparativa e perguntas frequentes.
// Valores reproduzidos do protótipo original; não há pagamento real.
const planos = [
  {
    id: "ultra", nome: "Cultura Ultra", destaque: true, selo: "Mais vendido",
    descricao: "Para quem quer aproveitar ao máximo.",
    etiqueta: "Primeiros 2 meses", preco: "24,90", sufixo: "/mês", depois: "Depois, R$ 49,90/mês",
    itens: ["7.000 pontos + bônus", "Acesso a eventos exclusivos", "Descontos especiais"],
    botao: "Escolher Ultra",
  },
  {
    id: "confort", nome: "Cultura Confort", destaque: false,
    descricao: "Para descobrir novos programas.",
    etiqueta: "Primeiros 2 meses", preco: "11,90", sufixo: "/mês", depois: "Depois, R$ 29,90/mês",
    itens: ["4.500 pontos + bônus", "Acesso a eventos culturais", "Descontos exclusivos"],
    botao: "Escolher Confort",
  },
  {
    id: "basico", nome: "Cultura Básico", destaque: false,
    descricao: "Para aproveitar no seu próprio ritmo.",
    etiqueta: "Pague apenas no mês que usar", preco: "19,90", sufixo: "/mês utilizado",
    depois: "Sem cobrança nos meses sem uso*",
    itens: ["3.000 pontos + bônus", "Descontos em eventos", "Acesso aos eventos do mês"],
    botao: "Escolher Básico",
  },
];

const comparativo = [
  { item: "Pontos mensais", ultra: "7.000", confort: "4.500", basico: "3.000" },
  { item: "Eventos exclusivos", ultra: "Sim", confort: "Não", basico: "Não" },
  { item: "Descontos", ultra: "Especiais", confort: "Exclusivos", basico: "Em eventos" },
  { item: "Cobrança", ultra: "Mensal", confort: "Mensal", basico: "Só no mês de uso" },
];

const faq = [
  { p: "Preciso pagar para criar uma conta?", r: "Não. Criar a conta é gratuito e já rende 1.000 pontos de boas-vindas." },
  { p: "Os eventos e preços são reais?", r: "Não. Este é um projeto de TCC: eventos, planos e preços são exemplos para demonstrar o funcionamento do site." },
  { p: "Como funcionam os pontos?", r: "Você acumula pontos ao participar de eventos e poderá trocá-los por vantagens quando o programa estiver ativo." },
  { p: "Posso trocar de plano depois?", r: "Sim. Na versão final será possível mudar de plano a qualquer momento pelo seu perfil." },
];

module.exports = { planos, comparativo, faq };
