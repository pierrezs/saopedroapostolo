/* Paróquia São Pedro Apóstolo — monta as páginas a partir do conteudo.js
   Você NÃO precisa mexer neste arquivo para atualizar o site. */
(function () {
  "use strict";
  var S = window.SITE || (typeof SITE !== "undefined" ? SITE : null);
  var app = document.getElementById("app");
  if (!S || !app) return;
  var P = S.paroquia || {};
  var pagina = document.body.getAttribute("data-pagina") || "inicio";

  /* ---------------- utilidades ---------------- */
  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function lista(arr) { return Array.isArray(arr) ? arr.filter(Boolean) : []; }
  function norm(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function mapsLink(q) { return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q); }
  function wppLink(num, msg) {
    return "https://wa.me/" + String(num || "").replace(/\D/g, "") + (msg ? "?text=" + encodeURIComponent(msg) : "");
  }
  function telLink(t) { return "tel:+55" + String(t || "").replace(/\D/g, ""); }

  var DIAS = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];
  var DIAS_NOME = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  var MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

  function indiceDia(nome) {
    var n = norm(nome);
    for (var i = 0; i < DIAS.length; i++) if (n.indexOf(DIAS[i]) === 0) return i;
    return -1;
  }
  // "Segunda a Sexta" -> [1..5]; "Terça e Quinta" -> [2,4]
  function parseDias(txt) {
    var n = norm(txt), achados = [];
    DIAS.forEach(function (d, i) {
      var pos = n.indexOf(d);
      if (pos > -1) achados.push({ i: i, pos: pos });
    });
    achados.sort(function (a, b) { return a.pos - b.pos; });
    if (achados.length === 2 && / a /.test(n)) {
      var r = [], i = achados[0].i;
      for (var k = 0; k < 7; k++) { r.push(i); if (i === achados[1].i) break; i = (i + 1) % 7; }
      return r;
    }
    return achados.map(function (a) { return a.i; });
  }
  // "19h30" -> 1170 (minutos)
  function minutos(h) {
    var m = String(h).match(/(\d{1,2})\s*h\s*(\d{2})?/i) || String(h).match(/(\d{1,2}):(\d{2})/);
    return m ? parseInt(m[1], 10) * 60 + (m[2] ? parseInt(m[2], 10) : 0) : null;
  }
  // "8h às 12h e 13h às 17h" -> [[480,720],[780,1020]]
  function intervalos(txt) {
    var r = [], re = /(\d{1,2})\s*h\s*(\d{2})?\s*(?:às|as|a|-|–)\s*(\d{1,2})\s*h\s*(\d{2})?/gi, m;
    while ((m = re.exec(txt))) r.push([+m[1] * 60 + (+m[2] || 0), +m[3] * 60 + (+m[4] || 0)]);
    return r;
  }
  function hojeISO() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function codigoInsta(url) {
    var m = String(url).match(/instagram\.com\/(?:[^\/]+\/)?(p|reel|tv)\/([A-Za-z0-9_-]+)/);
    return m ? { tipo: m[1] === "tv" ? "p" : m[1], id: m[2] } : null;
  }

  /* ---------------- ícones (traço simples) ---------------- */
  var I = {
    relogio: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    gota: '<path d="M12 3s6 6.6 6 11a6 6 0 0 1-12 0c0-4.4 6-11 6-11z"/>',
    pino: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    livro: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/><path d="M12 7v6M9 10h6"/>',
    casa: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',
    sino: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
    coracao: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    fone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    conversa: '<path d="M4 20l1.4-4A8 8 0 1 1 8 19z"/><path d="M9.5 9.5c.3 2 2 3.7 4 4l1.2-1.1 1.8.8-.4 1.5c-3.3.2-6.6-3.1-6.4-6.4l1.5-.4.8 1.8z"/>',
    email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    seta: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    copiar: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/>',
  };
  function icone(n) {
    return '<svg class="icone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (I[n] || "") + "</svg>";
  }

  var IGREJA = '<svg viewBox="0 0 320 370" fill="none" stroke="#f3e6c4" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">' +
    '<path d="M160 14v40M147 28h26" stroke="#c99a3b" stroke-width="4"/>' +
    '<path d="M24 352h272M40 344h240" opacity=".6"/>' +
    '<path d="M60 344V222l100-46 100 46v122z" fill="rgba(255,255,255,.04)"/>' +
    '<path d="M128 112l32-50 32 50z" fill="#1a3560"/>' +
    '<rect x="128" y="112" width="64" height="92" fill="#1a3560"/>' +
    '<circle cx="160" cy="134" r="9"/>' +
    '<path d="M149 192v-28a11 11 0 0 1 22 0v28z"/>' +
    '<path d="M136 344v-62a24 24 0 0 1 48 0v62"/><path d="M160 258v86" opacity=".5"/>' +
    '<path d="M84 300v-38a12 12 0 0 1 24 0v38zM212 300v-38a12 12 0 0 1 24 0v38z"/>' +
    '<path d="M60 222h200" opacity=".5"/>' +
    '<g stroke="#c99a3b" opacity=".7"><path d="M10 362c30-6 50 6 80 0s50-6 80 0 50 6 80 0 40-4 60 0"/></g>' +
    "</svg>";

  /* ---------------- topo e rodapé ---------------- */
  var MENU = [
    ["inicio", "index.html", "Início"],
    ["paroquia", "paroquia.html", "A Paróquia"],
    ["horarios", "horarios.html", "Horários"],
    ["sacramentos", "sacramentos.html", "Sacramentos"],
    ["comunidades", "comunidades.html", "Comunidades"],
    ["avisos", "avisos.html", "Avisos"],
    ["casa-de-formacao", "casa-de-formacao.html", "Casa de Formação"],
    ["contato", "contato.html", "Contato"],
  ];

  function marca() {
    return '<a class="marca" href="index.html">' +
      (S.imagens && S.imagens.logo ? '<img src="' + esc(S.imagens.logo) + '" alt="" width="46" height="46">' : "") +
      "<div><strong>" + esc(P.nome) + "</strong><span>" + esc(P.local) + "</span></div></a>";
  }

  function redesLinks() {
    var r = S.redes || {}, out = [];
    if (r.instagram) out.push('<a href="' + esc(r.instagram) + '" target="_blank" rel="noopener">Instagram</a>');
    if (r.facebook) out.push('<a href="' + esc(r.facebook) + '" target="_blank" rel="noopener">Facebook</a>');
    if (r.youtube) out.push('<a href="' + esc(r.youtube) + '" target="_blank" rel="noopener">YouTube</a>');
    return out;
  }

  function topo() {
    var faixa = '<div class="faixa"><div class="container"><span>' + esc(P.arquidiocese) + "</span>" +
      '<span class="faixa-redes">' + redesLinks().join("") + "</span></div></div>";
    var itens = MENU.map(function (m) {
      return '<li><a href="' + m[1] + '"' + (m[0] === pagina ? ' aria-current="page"' : "") + ">" + m[2] + "</a></li>";
    }).join("");
    return '<a class="pular" href="#conteudo">Pular para o conteúdo</a>' + faixa +
      '<header class="topo"><div class="container">' + marca() +
      '<button class="menu-botao" aria-expanded="false" aria-controls="menu">' + icone("menu") + "Menu</button>" +
      '<nav aria-label="Principal"><ul class="menu" id="menu">' + itens + "</ul></nav></div></header>";
  }

  function blocoPix(classe) {
    var d = S.doacoes || {};
    if (!d.pix) return "";
    return '<div class="' + (classe || "") + '"><p>' + esc(d.texto) + "</p>" +
      '<div class="pix"><span>PIX:</span><code id="chave-pix">' + esc(d.pix) + "</code>" +
      '<button class="botao botao-ouro botao-pequeno" data-copiar="' + esc(d.pix) + '">' + icone("copiar") + "Copiar</button></div>" +
      (d.favorecido ? '<p style="margin-top:8px;font-size:.88rem;opacity:.8">Favorecido: ' + esc(d.favorecido) + "</p>" : "") + "</div>";
  }

  function rodape() {
    var sec = lista(S.secretaria).map(function (s) { return "<li><strong>" + esc(s.dias) + ":</strong> " + esc(s.horario) + "</li>"; }).join("");
    var contatos = [];
    if (P.endereco) contatos.push('<li><a href="' + mapsLink(P.endereco) + '" target="_blank" rel="noopener">' + esc(P.endereco) + "</a></li>");
    if (P.telefone) contatos.push('<li>Telefone: <a href="' + telLink(P.telefone) + '">' + esc(P.telefone) + "</a></li>");
    if (P.whatsapp) contatos.push('<li>WhatsApp: <a href="' + wppLink(P.whatsapp) + '" target="_blank" rel="noopener">' + esc(P.whatsappTexto || P.whatsapp) + "</a></li>");
    if (P.email) contatos.push('<li><a href="mailto:' + esc(P.email) + '">' + esc(P.email) + "</a></li>");
    var d = S.doacoes || {};
    return '<footer class="rodape"><div class="container"><div class="grade">' +
      "<div>" + marca() + "<ul>" + contatos.join("") + "</ul></div>" +
      "<div><h3>Secretaria paroquial</h3><ul>" + sec + "</ul>" +
      '<h3 style="margin-top:20px">Siga a paróquia</h3><ul>' + redesLinks().map(function (l) { return "<li>" + l + "</li>"; }).join("") + "</ul></div>" +
      "<div>" + (d.pix ? "<h3>Dízimo e ofertas</h3>" + blocoPix() : "<h3>Navegue</h3><ul>" + MENU.map(function (m) { return '<li><a href="' + m[1] + '">' + m[2] + "</a></li>"; }).join("") + "</ul>") + "</div>" +
      '</div><div class="rodape-fim"><span>© ' + new Date().getFullYear() + " " + esc(P.nome) + "</span><span>" + esc(P.arquidiocese) + "</span></div></div></footer>" +
      (P.whatsapp ? '<a class="wpp-flutuante" href="' + wppLink(P.whatsapp, "Olá! Vim pelo site da paróquia.") + '" target="_blank" rel="noopener" aria-label="Falar com a secretaria no WhatsApp">' + icone("conversa").replace('class="icone"', "") + "</a>" : "");
  }

  function tituloPagina(titulo, texto) {
    return '<section class="titulo-pagina"><div class="container"><div class="migalha"><a href="index.html">Início</a> › ' + esc(titulo) + "</div>" +
      "<h1>" + esc(titulo) + "</h1>" + (texto ? "<p>" + esc(texto) + "</p>" : "") + "</div></section>";
  }
  function cabecalho(olho, titulo, texto, extra) {
    return '<div class="cabecalho-secao"><div>' + (olho ? '<span class="olho">' + esc(olho) + "</span>" : "") +
      "<h2>" + esc(titulo) + "</h2>" + (texto ? "<p>" + esc(texto) + "</p>" : "") + "</div>" + (extra || "") + "</div>";
  }

  /* ---------------- blocos reutilizáveis ---------------- */
  function proximaMissa() {
    var agora = new Date(), hoje = agora.getDay(), min = agora.getHours() * 60 + agora.getMinutes();
    var porDia = {};
    lista(S.missas).forEach(function (m) {
      var i = indiceDia(m.dia);
      if (i > -1) porDia[i] = (porDia[i] || []).concat(lista(m.horas));
    });
    for (var k = 0; k < 8; k++) {
      var d = (hoje + k) % 7;
      var hs = (porDia[d] || []).map(function (h) { return { t: h, m: minutos(h) }; })
        .filter(function (h) { return h.m != null && (k > 0 || h.m > min - 15); })
        .sort(function (a, b) { return a.m - b.m; });
      if (hs.length) return { quando: k === 0 ? "Hoje" : k === 1 ? "Amanhã" : DIAS_NOME[d], hora: hs[0].t };
    }
    return null;
  }

  function statusSecretaria() {
    var agora = new Date(), d = agora.getDay(), min = agora.getHours() * 60 + agora.getMinutes();
    var hojeTxt = "";
    var aberta = lista(S.secretaria).some(function (s) {
      if (parseDias(s.dias).indexOf(d) === -1) return false;
      hojeTxt = s.horario;
      return intervalos(s.horario).some(function (iv) { return min >= iv[0] && min < iv[1]; });
    });
    return { aberta: aberta, hoje: hojeTxt };
  }

  function faixaHoje() {
    var agora = new Date();
    var dataTxt = DIAS_NOME[agora.getDay()] + (agora.getDay() > 0 && agora.getDay() < 6 ? "-feira" : "") + ", " + agora.getDate() + " de " + MESES[agora.getMonth()];
    var pm = proximaMissa(), st = statusSecretaria();
    return '<div class="container"><div class="hoje" aria-label="Hoje na paróquia">' +
      '<div><div class="rotulo">Hoje</div><div class="valor">' + esc(dataTxt) + '</div><div class="detalhe"><a href="https://liturgia.cancaonova.com/pb/" target="_blank" rel="noopener">Ler a liturgia do dia</a></div></div>' +
      '<div><div class="rotulo">Próxima missa na Matriz</div><div class="valor">' + (pm ? esc(pm.quando + ", " + pm.hora) : "Consulte") + '</div><div class="detalhe"><a href="horarios.html">Ver todos os horários</a></div></div>' +
      '<div><div class="rotulo">Secretaria</div><div class="valor"><span class="status' + (st.aberta ? " aberta" : "") + '">' + (st.aberta ? "Aberta agora" : "Fechada agora") + "</span></div>" +
      '<div class="detalhe">' + (st.hoje ? "Hoje: " + esc(st.hoje) : "Hoje não abre") + "</div></div>" +
      "</div></div>";
  }

  function destaquesAtivos() {
    var h = hojeISO();
    return lista(S.destaques).filter(function (d) { return !d.ate || d.ate >= h; });
  }
  function cartoesDestaques(itens) {
    return itens.map(function (d) {
      var bts = [];
      if (d.link) bts.push('<a class="botao botao-azul botao-pequeno" href="' + esc(d.link) + '" target="_blank" rel="noopener">' + esc(d.linkTexto || "Saiba mais") + "</a>");
      if (d.link2) bts.push('<a class="botao botao-linha botao-pequeno" href="' + esc(d.link2) + '" target="_blank" rel="noopener">' + esc(d.link2Texto || "Saiba mais") + "</a>");
      return '<article class="cartao destaque">' + (d.data ? '<span class="quando">' + esc(d.data) + "</span>" : "") +
        "<h3>" + esc(d.titulo) + "</h3><p>" + esc(d.texto) + "</p>" + (bts.length ? '<div class="botoes">' + bts.join("") + "</div>" : "") + "</article>";
    }).join("");
  }

  function gradeInsta(qtd) {
    var posts = lista(S.instagramPosts).map(codigoInsta).filter(Boolean).slice(0, qtd || 99);
    if (!posts.length) return '<p class="vazio">Nenhum post selecionado ainda.</p>';
    return '<div class="insta-grade">' + posts.map(function (p) {
      return '<iframe src="https://www.instagram.com/' + p.tipo + "/" + esc(p.id) + '/embed/captioned/" loading="lazy" title="Publicação do Instagram da paróquia" scrolling="no" allowtransparency="true"></iframe>';
    }).join("") + "</div>";
  }

  function cartoesComunidades(itens) {
    return itens.map(function (c) {
      return '<article class="cartao comunidade' + (c.destaque ? " principal" : "") + '"><span class="bairro">' + esc(c.bairro) + "</span>" +
        "<h3>" + esc(c.nome) + "</h3>" + (c.endereco ? "<p>" + esc(c.endereco) + "</p>" : "") +
        '<div class="botoes"><a class="botao botao-linha botao-pequeno" href="' + mapsLink(c.busca || c.endereco || c.bairro) + '" target="_blank" rel="noopener">' + icone("pino") + "Como chegar</a></div></article>";
    }).join("");
  }

  function listaHorarios() {
    var hoje = new Date().getDay();
    var itens = lista(S.missas).slice().sort(function (a, b) { return indiceDia(a.dia) - indiceDia(b.dia); });
    return '<ul class="horarios">' + itens.map(function (m) {
      return '<li class="' + (indiceDia(m.dia) === hoje ? "hoje-dia" : "") + '"><span class="dia">' + esc(m.dia) + '</span><span class="horas">' +
        lista(m.horas).map(function (h) { return '<span class="hora">' + esc(h) + "</span>"; }).join("") + "</span></li>";
    }).join("") + "</ul>";
  }

  /* ---------------- páginas ---------------- */
  var paginas = {};

  paginas.inicio = function () {
    var img = S.imagens || {};
    var capa = '<section class="capa' + (img.capa ? " com-foto" : "") + '">' +
      (img.capa ? '<img class="capa-foto" src="' + esc(img.capa) + '" alt="">' : "") +
      '<div class="container"><div><div class="sobretitulo">' + esc(P.local) + "</div>" +
      "<h1>" + esc(P.nome) + "</h1>" + (P.frase ? '<p class="frase">“' + esc(P.frase) + '”</p>' : "") +
      '<p class="texto">' + esc(P.apresentacao) + "</p>" +
      '<div class="botoes"><a class="botao botao-ouro" href="horarios.html">' + icone("relogio") + "Horários de missa</a>" +
      (P.whatsapp ? '<a class="botao botao-claro" href="' + wppLink(P.whatsapp, "Olá! Vim pelo site da paróquia.") + '" target="_blank" rel="noopener">' + icone("conversa") + "Falar com a secretaria</a>" : "") +
      '</div></div><div class="capa-ilustracao">' + IGREJA + "</div></div></section>";

    var dest = destaquesAtivos();
    var blocoDest = dest.length ? '<section class="secao"><div class="container">' +
      cabecalho("Agenda", "Acontece na paróquia", "", '<a class="botao botao-linha botao-pequeno" href="avisos.html">Todos os avisos ' + icone("seta") + "</a>") +
      '<div class="grade grade-3">' + cartoesDestaques(dest.slice(0, 3)) + "</div></div></section>" : "";

    var atalhos = [
      ["horarios.html", "relogio", "Missas e confissões", "Horários da Matriz e atendimento de confissões."],
      ["sacramentos.html", "gota", "Sacramentos", "Batismo, casamento, catequese e documentos."],
      ["comunidades.html", "pino", "Comunidades", lista(S.comunidades).length + " igrejas e capelas para você participar."],
      ["casa-de-formacao.html", "casa", "Casa de Formação", "Espaço para retiros e encontros de até 120 pessoas."],
    ];
    var blocoAtalhos = '<section class="secao' + (dest.length ? " secao-branca" : "") + '"><div class="container">' +
      cabecalho("Serviços", "Como podemos ajudar?", "") + '<div class="grade grade-4">' +
      atalhos.map(function (a) {
        return '<a class="cartao atalho" href="' + a[0] + '"><span class="simbolo">' + icone(a[1]) + "</span><h3>" + a[2] + "</h3><p>" + esc(a[3]) + '</p><span class="seta">Acessar →</span></a>';
      }).join("") + "</div></div></section>";

    var blocoInsta = lista(S.instagramPosts).length ? '<section class="secao' + (dest.length ? "" : " secao-branca") + '"><div class="container">' +
      cabecalho("Avisos", "Últimas do nosso Instagram", "Acompanhe avisos, eventos e a vida da paróquia.",
        S.redes && S.redes.instagram ? '<a class="botao botao-azul botao-pequeno" href="' + esc(S.redes.instagram) + '" target="_blank" rel="noopener">Seguir @s.pedroapostolo</a>' : "") +
      gradeInsta(3) + "</div></section>" : "";

    var comunidades = lista(S.comunidades);
    var blocoCom = '<section class="secao secao-azul"><div class="container">' +
      cabecalho("Comunidades", "Uma paróquia, muitas comunidades", "Encontre a igreja mais perto de você.", '<a class="botao botao-claro botao-pequeno" href="comunidades.html">Ver todas</a>') +
      '<div class="grade grade-3">' + cartoesComunidades(comunidades.slice(0, 3)) + "</div></div></section>";

    var anos = new Date().getFullYear();
    var blocoSobre = '<section class="secao"><div class="container sobre"><div>' +
      '<span class="olho">Nossa história</span><h2>Mais de cem anos de fé em Venda das Pedras</h2>' +
      "<p>Tudo começou em 1919, quando os católicos do bairro decidiram construir uma pequena capela. Ela foi inaugurada em 1921 e, em 1970, tornou-se paróquia. Hoje somos uma família de comunidades unida pela fé, pela Palavra e pela Eucaristia.</p>" +
      '<div class="numeros"><div><strong>' + (anos - 1921) + '</strong><span>anos desde a primeira missa</span></div>' +
      "<div><strong>" + (anos - 1970) + "</strong><span>anos como paróquia</span></div>" +
      "<div><strong>" + comunidades.length + '</strong><span>igrejas e comunidades</span></div></div>' +
      '<div class="botoes" style="margin-top:24px"><a class="botao botao-linha" href="paroquia.html">Conheça a paróquia</a></div></div>' +
      '<div class="moldura">' + (img.historia ? '<img src="' + esc(img.historia) + '" alt="Igreja de São Pedro Apóstolo">' : '<div style="padding:24px 40px;height:100%;display:grid;place-items:center">' + IGREJA + "</div>") + "</div></div></section>";

    var d = S.doacoes || {};
    var blocoDizimo = d.pix ? '<section class="secao secao-azul chamada"><div class="container"><span class="olho">Dízimo e ofertas</span><h2>Faça parte desta missão</h2>' +
      blocoPix() + "</div></section>" : "";

    return capa + faixaHoje() + blocoDest + blocoAtalhos + blocoInsta + blocoCom + blocoSobre + blocoDizimo;
  };

  paginas.paroquia = function () {
    var clero = lista(S.clero).map(function (c) {
      var ini = String(c.nome || "").replace(/^(pe\.?|padre|diác\.?|dom)\s+/i, "").split(" ").map(function (p) { return p[0]; }).slice(0, 2).join("");
      return '<div class="cartao pessoa"><div class="avatar">' + (c.foto ? '<img src="' + esc(c.foto) + '" alt="">' : esc(ini)) + "</div><div><h3>" + esc(c.nome) + "</h3><p>" + esc(c.cargo) + "</p></div></div>";
    }).join("");
    var tempo = lista(S.historia).map(function (h) { return '<li><span class="ano">' + esc(h.ano) + "</span><p>" + esc(h.texto) + "</p></li>"; }).join("");
    var past = lista(S.pastorais).map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("");
    return tituloPagina("A Paróquia", P.apresentacao) +
      '<section class="secao"><div class="container sobre" style="align-items:start"><div>' +
      '<span class="olho">Nosso padroeiro</span><h2>São Pedro Apóstolo</h2>' +
      "<p>Pescador da Galileia, Pedro deixou as redes para seguir Jesus e recebeu dele a missão de confirmar os irmãos na fé. A Igreja o reconhece como o primeiro Papa e celebra sua solenidade, junto com São Paulo, em 29 de junho.</p>" +
      "<p>As chaves cruzadas do nosso símbolo lembram a promessa de Jesus: “Eu te darei as chaves do Reino dos Céus” (Mt 16,19).</p>" +
      (clero ? '<h3 style="margin-top:28px">Clero</h3><div class="grade">' + clero + "</div>" : "") +
      "</div><div><span class=\"olho\">Linha do tempo</span><h2>Nossa história</h2><ol class=\"tempo\">" + tempo + "</ol></div></div></section>" +
      (past ? '<section class="secao secao-branca"><div class="container">' + cabecalho("Participe", "Pastorais e movimentos", "Há um lugar para você servir. Procure a secretaria para saber dias e horários de cada grupo.") + '<ul class="chips">' + past + "</ul></div></section>" : "");
  };

  paginas.horarios = function () {
    var conf = lista(S.confissoes).map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("");
    var sec = lista(S.secretaria).map(function (s) {
      return '<li><span class="dia">' + esc(s.dias) + '</span><span class="horas"><span class="hora">' + esc(s.horario) + "</span></span></li>";
    }).join("");
    var st = statusSecretaria();
    return tituloPagina("Horários", "Missas, confissões e atendimento da secretaria paroquial.") +
      '<section class="secao"><div class="container grade grade-2" style="align-items:start"><div>' +
      '<span class="olho">Igreja Matriz</span><h2>Santas Missas</h2>' + listaHorarios() +
      (S.missasObservacao ? '<p class="nota" style="margin-top:16px">' + esc(S.missasObservacao) + "</p>" : "") +
      '<p style="margin-top:16px">Para horários das comunidades, veja a página <a href="comunidades.html">Comunidades</a> ou fale com a secretaria.</p></div>' +
      "<div>" + (conf ? '<span class="olho">Reconciliação</span><h2>Confissões</h2><div class="cartao"><ul class="lista">' + conf + "</ul></div>" : "") +
      '<span class="olho" style="margin-top:32px">Atendimento</span><h2>Secretaria</h2><ul class="horarios">' + sec + "</ul>" +
      '<p style="margin-top:12px"><span class="status' + (st.aberta ? " aberta" : "") + '">' + (st.aberta ? "Aberta agora" : "Fechada agora") + "</span></p>" +
      (P.whatsapp ? '<div class="botoes"><a class="botao botao-wpp" href="' + wppLink(P.whatsapp, "Olá! Vim pelo site da paróquia.") + '" target="_blank" rel="noopener">' + icone("conversa") + "WhatsApp da secretaria</a></div>" : "") +
      "</div></div></section>";
  };

  paginas.sacramentos = function () {
    var itens = lista(S.sacramentos).map(function (s, i) {
      var ls = lista(s.listas).map(function (l) {
        return "<h4>" + esc(l.nome) + '</h4><ul class="lista">' + lista(l.itens).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
      }).join("");
      return '<details class="sacramento"' + (i === 0 ? " open" : "") + "><summary>" + esc(s.titulo) + '</summary><div class="corpo"><p>' + esc(s.resumo) + "</p>" + ls + "</div></details>";
    }).join("");
    return tituloPagina("Sacramentos", "Documentos e orientações para receber os sacramentos na nossa paróquia.") +
      '<section class="secao"><div class="container" style="max-width:860px">' + itens +
      '<p class="nota">Ficou com dúvida? A secretaria ajuda você com tudo. ' + (P.whatsapp ? '<a href="' + wppLink(P.whatsapp, "Olá! Tenho uma dúvida sobre sacramentos.") + '" target="_blank" rel="noopener">Chame no WhatsApp</a>.' : "") + "</p></div></section>";
  };

  paginas.comunidades = function () {
    var c = lista(S.comunidades);
    return tituloPagina("Comunidades", "A Paróquia São Pedro Apóstolo é formada pela Igreja Matriz e por comunidades em vários bairros de Itaboraí.") +
      '<section class="secao"><div class="container"><div class="grade grade-3">' + cartoesComunidades(c) + "</div>" +
      '<p class="nota" style="margin-top:24px">Os horários de missa de cada comunidade são divulgados nos avisos e no nosso Instagram.</p></div></section>' +
      '<section class="secao secao-branca"><div class="container">' + cabecalho("Mapa", "Igreja Matriz", P.endereco) +
      '<iframe class="mapa" loading="lazy" title="Mapa da Igreja Matriz" src="https://www.google.com/maps?q=' + encodeURIComponent((c[0] && c[0].busca) || P.endereco) + '&output=embed"></iframe></div></section>';
  };

  paginas.avisos = function () {
    var dest = destaquesAtivos();
    return tituloPagina("Avisos e eventos", "O que está acontecendo na paróquia e nas comunidades.") +
      (dest.length ? '<section class="secao"><div class="container">' + cabecalho("Agenda", "Destaques", "") + '<div class="grade grade-3">' + cartoesDestaques(dest) + "</div></div></section>" : "") +
      '<section class="secao' + (dest.length ? " secao-branca" : "") + '"><div class="container">' +
      cabecalho("Instagram", "Publicações recentes", "Avisos publicados no @s.pedroapostolo.",
        S.redes && S.redes.instagram ? '<a class="botao botao-azul botao-pequeno" href="' + esc(S.redes.instagram) + '" target="_blank" rel="noopener">Ver perfil completo</a>' : "") +
      gradeInsta() + "</div></section>" +
      (lista(S.links).length ? '<section class="secao"><div class="container">' + cabecalho("Para você", "Links úteis", "") + '<div class="grade grade-3">' +
        lista(S.links).map(function (l) {
          return '<a class="cartao atalho" href="' + esc(l.url) + '" target="_blank" rel="noopener"><span class="simbolo">' + icone("livro") + "</span><h3>" + esc(l.titulo) + "</h3><p>" + esc(l.texto) + '</p><span class="seta">Abrir →</span></a>';
        }).join("") + "</div></div></section>" : "");
  };

  paginas["casa-de-formacao"] = function () {
    var c = S.casaFormacao || {}, img = (S.imagens || {}).casaFormacao;
    return tituloPagina("Casa de Formação", c.nome) +
      '<section class="secao"><div class="container sobre" style="align-items:start"><div>' +
      '<span class="olho">Retiros e encontros</span><h2>' + esc(c.nome) + "</h2><p>" + esc(c.texto) + "</p>" +
      '<div class="cartao"><h3>Estrutura</h3><ul class="lista">' + lista(c.estrutura).map(function (e) { return "<li>" + esc(e) + "</li>"; }).join("") + "</ul></div>" +
      '<p class="nota" style="margin-top:20px">' + esc(c.reservas) + "</p>" +
      (P.whatsapp ? '<div class="botoes"><a class="botao botao-wpp" href="' + wppLink(P.whatsapp, "Olá! Gostaria de informações sobre reserva da Casa de Formação.") + '" target="_blank" rel="noopener">' + icone("conversa") + "Consultar reserva</a></div>" : "") +
      '</div><div class="moldura">' + (img ? '<img src="' + esc(img) + '" alt="' + esc(c.nome) + '">' : '<div style="padding:24px 40px;height:100%;display:grid;place-items:center">' + IGREJA + "</div>") + "</div></div></section>";
  };

  paginas.contato = function () {
    var cartoes = [];
    if (P.whatsapp) cartoes.push(["conversa", "WhatsApp", P.whatsappTexto || P.whatsapp, wppLink(P.whatsapp, "Olá! Vim pelo site da paróquia."), "Enviar mensagem"]);
    if (P.telefone) cartoes.push(["fone", "Telefone", P.telefone, telLink(P.telefone), "Ligar"]);
    if (P.email) cartoes.push(["email", "E-mail", P.email, "mailto:" + P.email, "Escrever"]);
    var sec = lista(S.secretaria).map(function (s) { return "<li><strong>" + esc(s.dias) + ":</strong> " + esc(s.horario) + "</li>"; }).join("");
    return tituloPagina("Contato", "Fale com a secretaria paroquial ou venha nos visitar.") +
      '<section class="secao"><div class="container"><div class="grade grade-3">' +
      cartoes.map(function (c) {
        return '<div class="cartao"><span class="simbolo" style="width:48px;height:48px;border-radius:12px;display:grid;place-items:center;background:var(--ouro-claro);color:var(--azul)">' + icone(c[0]) + "</span><h3>" + c[1] + '</h3><p style="word-break:break-word">' + esc(c[2]) + '</p><div class="botoes"><a class="botao botao-linha botao-pequeno" href="' + esc(c[3]) + '"' + (c[0] === "conversa" ? ' target="_blank" rel="noopener"' : "") + ">" + c[4] + "</a></div></div>";
      }).join("") + "</div></div></section>" +
      '<section class="secao secao-branca"><div class="container grade grade-2" style="align-items:start"><div>' +
      '<span class="olho">Endereço</span><h2>Igreja Matriz</h2><p>' + esc(P.endereco) + "</p>" +
      '<div class="botoes" style="margin-bottom:24px"><a class="botao botao-azul" href="' + mapsLink(P.endereco) + '" target="_blank" rel="noopener">' + icone("pino") + "Abrir no Google Maps</a></div>" +
      '<h3>Horário da secretaria</h3><ul class="lista">' + sec + "</ul></div>" +
      '<iframe class="mapa" loading="lazy" title="Mapa da paróquia" src="https://www.google.com/maps?q=' + encodeURIComponent(P.endereco || P.nome) + '&output=embed"></iframe></div></section>' +
      ((S.doacoes || {}).pix ? '<section class="secao secao-azul chamada"><div class="container"><span class="olho">Dízimo e ofertas</span><h2>Contribua com a paróquia</h2>' + blocoPix() + "</div></section>" : "");
  };

  /* ---------------- montagem ---------------- */
  var corpo = (paginas[pagina] || paginas.inicio)();
  app.innerHTML = topo() + '<main id="conteudo">' + corpo + "</main>" + rodape();

  var titulos = { inicio: "", paroquia: "A Paróquia", horarios: "Horários", sacramentos: "Sacramentos", comunidades: "Comunidades", avisos: "Avisos", "casa-de-formacao": "Casa de Formação", contato: "Contato" };
  document.title = (titulos[pagina] ? titulos[pagina] + " · " : "") + (P.nome || "Paróquia");

  var botao = app.querySelector(".menu-botao"), menu = app.querySelector("#menu");
  if (botao && menu) botao.addEventListener("click", function () {
    var aberto = menu.classList.toggle("aberto");
    botao.setAttribute("aria-expanded", aberto ? "true" : "false");
  });

  app.addEventListener("click", function (e) {
    var b = e.target.closest("[data-copiar]");
    if (!b) return;
    var txt = b.getAttribute("data-copiar");
    var ok = function () { var o = b.innerHTML; b.textContent = "Copiado!"; setTimeout(function () { b.innerHTML = o; }, 1800); };
    if (navigator.clipboard) navigator.clipboard.writeText(txt).then(ok, function () {});
  });
})();
