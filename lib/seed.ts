// Dados de exemplo copiados do protótipo (design/Soter Loja v2.dc.html).
import type { Order, Product, Question, Review } from "./types";

export const SEED_PRODUCTS: Product[] = [
  { id: 'restaurante', ativo: true, nome: 'Site Restaurante', tipo: 'Site', cat: 'sites', preco: 197, nota: '4,9', aval: 18,
    resumo: 'Cardápio digital, reservas pelo WhatsApp e mapa — pronto para publicar.',
    desc: ['Um site de uma página pensado para restaurantes, lanchonetes e cafés. O cardápio fica num arquivo simples, então você troca pratos e preços sem mexer no resto.', 'Funciona bem no celular, carrega rápido e já vem com botão de reserva e localização.'],
    tech: [{ n: 'HTML', d: 'Estrutura das páginas' }, { n: 'Tailwind CSS', d: 'Visual responsivo, fácil de ajustar' }, { n: 'JavaScript', d: 'Cardápio filtrável e animações leves' }],
    incluso: ['Código-fonte completo', 'Cardápio editável em um arquivo', 'Botão de reserva via WhatsApp', 'Guia de publicação em PDF'] },
  { id: 'agenda', ativo: true, nome: 'App de Agendamento', tipo: 'App', cat: 'apps', preco: 347, nota: '5,0', aval: 12,
    resumo: 'Agenda online para salões, barbearias e clínicas, com lembretes automáticos.',
    desc: ['Seus clientes escolhem o serviço, o profissional e o horário direto pelo celular. Você acompanha tudo num painel e recebe cada novo agendamento na hora.', 'Os lembretes automáticos reduzem faltas, e o app roda em iOS e Android a partir do mesmo código.'],
    tech: [{ n: 'React Native', d: 'App para iOS e Android com um código só' }, { n: 'Firebase', d: 'Login, banco de dados e notificações' }],
    incluso: ['App iOS + Android', 'Painel web de gestão', 'Lembretes por notificação', 'Manual de publicação nas lojas'] },
  { id: 'loja', ativo: true, nome: 'Loja Virtual', tipo: 'Site', cat: 'sites', preco: 297, nota: '4,8', aval: 9,
    resumo: 'Catálogo, carrinho e pagamento integrados para vender online.',
    desc: ['Uma loja completa: vitrine, página de produto, carrinho e checkout. Ideal para quem vende pelo Instagram e quer um endereço próprio.', 'Os produtos são cadastrados num painel simples, sem precisar mexer no código.'],
    tech: [{ n: 'Next.js', d: 'Site rápido e bem posicionado no Google' }, { n: 'Stripe', d: 'Pagamentos com cartão e Pix' }, { n: 'Tailwind CSS', d: 'Visual responsivo' }],
    incluso: ['Código-fonte completo', 'Painel de produtos', 'Checkout integrado', 'Guia de configuração'] },
  { id: 'landing', ativo: true, nome: 'Landing de Serviços', tipo: 'Site', cat: 'sites', preco: 147, nota: '4,9', aval: 21, novo: true,
    resumo: 'Uma página para apresentar seu serviço e captar contatos.',
    desc: ['Para profissionais e prestadores de serviço que precisam de presença online rápida: quem você é, o que oferece, depoimentos e um formulário de contato.', 'Você troca textos e fotos e publica no mesmo dia.'],
    tech: [{ n: 'HTML', d: 'Estrutura da página' }, { n: 'CSS', d: 'Visual e responsividade' }],
    incluso: ['Código-fonte completo', 'Formulário de contato', 'Seção de depoimentos', 'Guia de publicação em PDF'] }
];
export const REVIEWS: Review[] = [
  { nome: 'Mariana S.', neg: 'Salão Bela Vista', txt: 'Coloquei no ar em um fim de semana seguindo o guia. Os clientes já agendam sozinhos.' },
  { nome: 'Roberto L.', neg: 'Cantina do Beto', txt: 'Muito mais barato que contratar do zero, e ficou com cara de site profissional.' },
  { nome: 'Juliana P.', neg: 'Clínica Vitta', txt: 'Tive uma dúvida na instalação e a resposta veio no mesmo dia.' }
];
export const SEED_QUESTIONS: Question[] = [
  { id: 'q1', pid: null, autor: 'Sóter', email: '', q: 'Preciso saber programar?', a: 'Não. O guia mostra passo a passo como trocar textos e imagens e publicar. Se travar, é só mandar sua dúvida pela área do cliente.', status: 'answered', publico: true, data: '01/08/2026' },
  { id: 'q2', pid: null, autor: 'Sóter', email: '', q: 'Como recebo os arquivos?', a: 'O download é liberado assim que o pagamento é confirmado. Ele fica salvo na sua área do cliente e o link também vai por e-mail.', status: 'answered', publico: true, data: '01/08/2026' },
  { id: 'q3', pid: null, autor: 'Sóter', email: '', q: 'Posso usar em mais de um negócio?', a: 'Cada compra vale para um negócio. Para usar em outros, compre uma licença por negócio.', status: 'answered', publico: true, data: '01/08/2026' },
  { id: 'q4', pid: 'restaurante', autor: 'Mariana Souza', email: 'cliente@demo.com', q: 'Consigo colocar o cardápio em inglês também?', a: '', status: 'pending', publico: false, data: '18/10/2026' },
  { id: 'q5', pid: 'agenda', autor: 'Carlos Mendes', email: 'carlos@barbeariacm.com', q: 'O app manda lembrete por WhatsApp ou só por notificação?', a: '', status: 'pending', publico: false, data: '19/10/2026' },
  { id: 'q6', pid: 'restaurante', autor: 'Mariana Souza', email: 'cliente@demo.com', q: 'Qual hospedagem você recomenda?', a: 'Para esse projeto, Netlify ou Vercel no plano gratuito já resolvem. O guia em PDF tem o passo a passo das duas.', status: 'answered', publico: false, data: '14/09/2026' }
];
export const SEED_ORDERS: Order[] = [
  { oid: '1042', pid: 'restaurante', email: 'cliente@demo.com', cliente: 'Mariana Souza', data: '12/09/2026', valor: 197 },
  { oid: '1043', pid: 'agenda', email: 'carlos@barbeariacm.com', cliente: 'Carlos Mendes', data: '03/10/2026', valor: 347 },
  { oid: '1044', pid: 'landing', email: 'ana@anafisio.com', cliente: 'Ana Ribeiro', data: '15/10/2026', valor: 147 }
];
