/* =====================================================================
   CONTEÚDO DO SITE — PARÓQUIA SÃO PEDRO APÓSTOLO
   ---------------------------------------------------------------------
   Este é o ÚNICO arquivo que você precisa editar para atualizar o site.

   Regras simples:
   • Mude só o que está entre aspas "assim".
   • Não apague vírgulas, chaves { } nem colchetes [ ].
   • Para remover um item de uma lista, apague o bloco { ... } inteiro
     junto com a vírgula que vem depois dele.
   • Campo vazio ("") = o bloco correspondente some do site sozinho.
   • Linhas que começam com // são comentários (o site ignora).

   ⚠️ Itens marcados com "CONFIRMAR" vieram do site antigo ou de posts
      e precisam ser conferidos pela secretaria antes de publicar.
   ===================================================================== */

const SITE = {

  /* ---------- DADOS GERAIS ---------- */
  paroquia: {
    nome: "Paróquia São Pedro Apóstolo",
    local: "Venda das Pedras · Itaboraí · RJ",
    arquidiocese: "Arquidiocese de Niterói · Vicariato Rural",
    frase: "Como São Pedro, ouvir a voz de Deus e lançar as redes.",
    apresentacao:
      "Somos uma comunidade de fé em Venda das Pedras, Itaboraí, reunida em torno da Eucaristia desde 1921. Aqui você encontra horários de missas, sacramentos, nossas comunidades e tudo o que acontece na paróquia.",
    endereco: "Av. 22 de Maio, 2280 – Venda das Pedras, Itaboraí – RJ, 24804-703",
    telefone: "(21) 2635-7331",            // CONFIRMAR (veio do site antigo)
    whatsapp: "5521988944491",            // só números, com 55 + DDD
    whatsappTexto: "(21) 98894-4491",
    email: "spvendadaspedras@gmail.com",   // CONFIRMAR qual e-mail usar
  },

  /* ---------- IMAGENS ----------
     Coloque as fotos na pasta "imagens" e escreva o nome do arquivo aqui.
     Se deixar "", o site usa uma ilustração no lugar.                     */
  imagens: {
    logo: "imagens/logo.svg",
    capa: "",          // ex.: "imagens/igreja.jpg" (foto da fachada, deitada)
    historia: "",      // ex.: "imagens/igreja-antiga.jpg"
    casaFormacao: "",  // ex.: "imagens/casa-de-formacao.jpg"
  },

  /* ---------- REDES SOCIAIS ---------- */
  redes: {
    instagram: "https://www.instagram.com/s.pedroapostolo/",
    facebook: "https://www.facebook.com/ParoquiaSaoPedroApostolo.VendaDasPedras",
    youtube: "https://www.youtube.com/channel/UC5uDSGRCid7iEylAsGCrtCA",
  },

  /* ---------- SECRETARIA ----------
     Dias aceitos: Domingo, Segunda, Terça, Quarta, Quinta, Sexta, Sábado
     Pode escrever "Segunda a Sexta" ou "Terça e Quinta".                 */
  secretaria: [                             // CONFIRMAR horários
    { dias: "Segunda a Sexta", horario: "8h às 12h e 13h às 17h" },
    { dias: "Sábado",          horario: "8h às 12h" },
  ],

  /* ---------- MISSAS NA MATRIZ ----------
     Um bloco por dia. "horas" é uma lista: ["8h", "19h30"]               */
  missas: [                                 // CONFIRMAR horários
    { dia: "Domingo", horas: ["8h", "19h"] },
    { dia: "Terça",   horas: ["19h"] },
    { dia: "Quarta",  horas: ["8h"] },
    { dia: "Quinta",  horas: ["19h"] },
    { dia: "Sexta",   horas: ["8h"] },
    { dia: "Sábado",  horas: ["16h", "19h30"] },
  ],
  missasObservacao:
    "Em festas e solenidades os horários podem mudar. Acompanhe os avisos e o nosso Instagram.",

  /* ---------- CONFISSÕES ---------- */
  confissoes: [                             // CONFIRMAR
    "Meia hora antes das missas de fim de semana",
    "Terça-feira, a partir das 14h",
    "Quinta-feira, a partir das 15h",
    "Direção espiritual: agende na secretaria",
  ],

  /* ---------- COMUNIDADES ----------
     "busca" é o que será procurado no Google Maps no botão "Como chegar". */
  comunidades: [
    {
      nome: "Igreja Matriz São Pedro Apóstolo",
      bairro: "Venda das Pedras",
      endereco: "Av. 22 de Maio, 2280",
      busca: "Paróquia São Pedro Apóstolo, Av. 22 de Maio 2280, Venda das Pedras, Itaboraí RJ",
      destaque: true,
    },
    {
      nome: "Matriz Auxiliar",
      bairro: "Venda das Pedras",
      endereco: "",                          // CONFIRMAR endereço
      busca: "Venda das Pedras, Itaboraí RJ",
    },
    {
      nome: "Comunidade Nossa Senhora Aparecida",
      bairro: "Colônia",
      endereco: "",                          // CONFIRMAR endereço
      busca: "Colônia, Itaboraí RJ",
    },
    {
      nome: "Comunidade Nossa Senhora Aparecida",
      bairro: "Agro Brasil",
      endereco: "Km 53, Rua 03",             // CONFIRMAR
      busca: "Agro Brasil, Itaboraí RJ",
    },
    {
      nome: "Comunidade Nossa Senhora Aparecida",
      bairro: "Areal",
      endereco: "",                          // CONFIRMAR endereço
      busca: "Areal, Itaboraí RJ",
    },
    {
      nome: "Comunidade N. Sra. da Conceição e São Roque",
      bairro: "Muriqui",
      endereco: "",                          // CONFIRMAR endereço
      busca: "Muriqui, Itaboraí RJ",
    },
    {
      nome: "Comunidade São Paulo da Cruz e N. Sra. do Carmo",
      bairro: "Quissamã",
      endereco: "",                          // CONFIRMAR endereço
      busca: "Quissamã, Itaboraí RJ",
    },
  ],

  /* ---------- DESTAQUES / EVENTOS ----------
     "ate" = último dia em que o destaque aparece (ano-mês-dia).
     Depois dessa data ele some sozinho do site.                          */
  destaques: [
    {
      titulo: "20º Semear",
      data: "31 de outubro e 1º de novembro",
      texto: "Encontro para crianças: sábado (31) de 4 a 7 anos e domingo (1º) de 8 a 10 anos. Dúvidas: (21) 99850-2592.",
      link: "https://forms.gle/KXRa2ZxqDDJJZwaY6",
      linkTexto: "Inscrição 4 a 7 anos",
      link2: "https://forms.gle/QF3be1aFasqDyLHw7",
      link2Texto: "Inscrição 8 a 10 anos",
      ate: "2026-11-01",
    },
    {
      titulo: "Festejos de São Paulo da Cruz",
      data: "16 a 19 de outubro",
      texto: "Tríduo e festa do padroeiro na Comunidade São Paulo da Cruz e Nossa Senhora do Carmo, em Quissamã.",
      link: "",
      linkTexto: "",
      ate: "2026-10-19",
    },
    {
      titulo: "Aulas de violão e teclado",
      data: "Inscrições abertas",
      texto: "Das 9h30 às 10h30, 2 vezes ao mês, na paróquia. A partir de 10 anos. Mensalidade R$ 60. Informações: (21) 98880-6880.",
      link: "https://wa.me/5521988806880",
      linkTexto: "Quero me inscrever",
      ate: "2026-12-20",
    },
  ],

  /* ---------- AVISOS DO INSTAGRAM ----------
     Cole aqui o link dos posts que quer mostrar (o mais novo primeiro).
     No Instagram: abra o post › ⋯ › Copiar link.                         */
  instagramPosts: [
    "https://www.instagram.com/p/DeSeVzRNZ2Z/",
    "https://www.instagram.com/p/DeSdkzAslnv/",
    "https://www.instagram.com/p/DeNHVnTFZy_/",
    "https://www.instagram.com/p/DeKUmSrFUV-/",
    "https://www.instagram.com/p/DeCEf9ClTya/",
    "https://www.instagram.com/p/Dd8xWUkgZfL/",
  ],

  /* ---------- LINKS ÚTEIS ---------- */
  links: [
    { titulo: "Pílulas de Catequese", texto: "Formação em pequenas doses com o Pe. Marcelo Froés.", url: "https://drive.google.com/drive/folders/1AXpDoAA9n0h1KKB77uwaY-XUS9z_5Gw3" },
    { titulo: "Liturgia diária", texto: "Leituras e Evangelho do dia.", url: "https://liturgia.cancaonova.com/pb/" },
  ],

  /* ---------- DÍZIMO E DOAÇÕES ----------
     Preencha a chave PIX para o bloco aparecer no site.                  */
  doacoes: {
    pix: "",                                  // ex.: "12.345.678/0001-90"
    favorecido: "Paróquia São Pedro Apóstolo",
    texto: "Seu dízimo e suas ofertas mantêm a paróquia viva e ajudam quem mais precisa. Obrigado pela sua generosidade!",
  },

  /* ---------- CLERO ---------- */
  clero: [
    { nome: "Pe. Marcelo Froés", cargo: "Pároco", foto: "" },   // CONFIRMAR nome e cargo
  ],

  /* ---------- PASTORAIS E MOVIMENTOS ---------- */
  pastorais: [                              // CONFIRMAR / completar a lista
    "Catequese",
    "Pastoral do Batismo",
    "Pastoral da Comunicação (PASCOM)",
    "Semear e Adolescentes de Pedro",
    "Ministério de Música",
  ],

  /* ---------- HISTÓRIA ---------- */
  historia: [
    { ano: "1919", texto: "Católicos de Venda das Pedras se reúnem para construir uma capela no bairro. O terreno é doado por Pedro Novaes e a pedra fundamental é lançada em 9 de agosto." },
    { ano: "1921", texto: "Em 26 de junho a capela é inaugurada com grande festa. A primeira missa é celebrada pelo Pe. Eugênio Cavout. Por décadas, ela pertence à Paróquia de São João Batista." },
    { ano: "1953", texto: "A capela é reformada e ampliada pelo Pe. Hugo Montedoneo Rego." },
    { ano: "1970", texto: "Em 2 de janeiro, Dom Antônio de Morais Júnior eleva a capela a paróquia." },
    { ano: "1976", texto: "Chegam os padres passionistas, que incentivam a construção da Casa de Formação no Pico. As irmãs passionistas servem na evangelização até 1994." },
    { ano: "2004", texto: "A comunidade cresce e, em 8 de fevereiro, é lançada a pedra fundamental do novo templo, com capacidade para mil pessoas." },
    { ano: "Hoje", texto: "Seguimos construindo juntos: uma Igreja Matriz, várias comunidades e muitas pastorais a serviço do povo de Itaboraí." },
  ],

  /* ---------- SACRAMENTOS ---------- */
  sacramentos: [
    {
      titulo: "Batismo",
      resumo: "Entrega de documentos no 1º domingo do mês, às 9h30, no salão paroquial, com a Pastoral do Batismo. Não há taxa.",
      listas: [
        { nome: "Documentos (cópias)", itens: [
          "Certidão de nascimento da criança",
          "Comprovante de residência",
          "Documento de identidade dos padrinhos",
          "Comprovante de Crisma dos padrinhos",
        ]},
        { nome: "Padrinhos", itens: [
          "Ter no mínimo 16 anos",
          "Ser católico, batizado, com Primeira Comunhão e Crisma",
          "Se casados, casamento realizado na Igreja Católica",
        ]},
        { nome: "Importante", itens: [
          "Crianças até 7 anos podem ser batizadas mesmo que os pais não sejam casados",
          "A partir dos 7 anos é preciso fazer a catequese antes",
          "Quem mora fora da paróquia precisa de autorização do pároco de origem",
        ]},
      ],
    },
    {
      titulo: "Matrimônio",
      resumo: "Agende com pelo menos 6 meses de antecedência. O casamento só fica marcado após a entrega de toda a documentação.",
      listas: [
        { nome: "Documentos", itens: [
          "Certidão de Batismo para casamento (validade de 6 meses), retirada na igreja onde foi batizado",
          "Cópia da certidão de nascimento ou de casamento civil",
          "Cópia da identidade e do comprovante de residência dos noivos",
          "Cópia da identidade de duas testemunhas maiores de 18 anos",
          "Certificado do Curso de Noivos (validade de 6 meses)",
          "Habilitação civil do cartório (dar entrada 60 dias antes)",
        ]},
        { nome: "Requisitos", itens: [
          "Noivos maiores de 18 anos",
          "Ao menos um dos noivos batizado na Igreja Católica e morador da paróquia",
          "Avise a secretaria se houver casamento civil anterior, batismo em outra igreja ou parentesco",
          "As músicas da cerimônia devem ser católicas",
        ]},
      ],
    },
    {
      titulo: "Catequese, Primeira Eucaristia e Crisma",
      resumo: "Turmas para crianças, jovens e adultos. Procure a secretaria para saber as datas de inscrição.",
      listas: [],
    },
    {
      titulo: "Unção dos Enfermos",
      resumo: "Para levar o padre a um doente ou idoso, entre em contato com a secretaria pelo telefone ou WhatsApp.",
      listas: [],
    },
  ],

  /* ---------- CASA DE FORMAÇÃO ---------- */
  casaFormacao: {
    nome: "Casa de Formação Cristã São Paulo da Cruz",
    texto: "Espaço da paróquia para retiros, encontros e eventos religiosos de grupos, paróquias e movimentos, com capacidade para até 120 pessoas.",
    estrutura: [
      "22 quartos com 4 camas, em duas alas com banheiros coletivos",
      "Quarto com banheiro para o padre acompanhante",
      "Cozinha equipada com forno e liquidificador industriais e freezers",
      "Refeitório com 120 lugares",
      "Sala de palestras com 120 cadeiras e quadro branco",
      "Capela, estacionamento e banheiros externos",
    ],
    reservas: "Para reservas e valores, fale com a secretaria paroquial.",
  },
};
