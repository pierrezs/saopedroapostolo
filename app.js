/* Paróquia São Pedro Apóstolo — monta as páginas a partir do conteudo.js
   Você NÃO precisa mexer neste arquivo para atualizar o site. */
(function () {
  "use strict";
  var S = window.SITE || (typeof SITE !== "undefined" ? SITE : null);
  var app = document.getElementById("app");
  if (!S || !app) return;
  var P = S.paroquia || {};
  var pagina = document.body.getAttribute("data-pagina") || "inicio";
  var API_LITURGIA = "https://liturgia.up.railway.app/v2/";

  /* ================= utilidades ================= */
  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function lista(arr) { return Array.isArray(arr) ? arr.filter(Boolean) : []; }
  function norm(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function mapsLink(q) { return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q); }
  function wppLink(num, msg) { return "https://wa.me/" + String(num || "").replace(/\D/g, "") + (msg ? "?text=" + encodeURIComponent(msg) : ""); }
  function telLink(t) { return "tel:+55" + String(t || "").replace(/\D/g, ""); }
  function ext(href) { return ' href="' + esc(href) + '" target="_blank" rel="noopener"'; }

  var DIAS = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];
  var DIAS_NOME = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  var MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

  function indiceDia(nome) {
    var n = norm(nome);
    for (var i = 0; i < DIAS.length; i++) if (n.indexOf(DIAS[i]) === 0) return i;
    return -1;
  }
  function parseDias(txt) {
    var n = norm(txt), achados = [];
    DIAS.forEach(function (d, i) { var pos = n.indexOf(d); if (pos > -1) achados.push({ i: i, pos: pos }); });
    achados.sort(function (a, b) { return a.pos - b.pos; });
    if (achados.length === 2 && / a /.test(n)) {
      var r = [], i = achados[0].i;
      for (var k = 0; k < 7; k++) { r.push(i); if (i === achados[1].i) break; i = (i + 1) % 7; }
      return r;
    }
    return achados.map(function (a) { return a.i; });
  }
  function minutos(h) {
    var m = String(h).match(/(\d{1,2})\s*h\s*(\d{2})?/i) || String(h).match(/(\d{1,2}):(\d{2})/);
    return m ? parseInt(m[1], 10) * 60 + (m[2] ? parseInt(m[2], 10) : 0) : null;
  }
  function intervalos(txt) {
    var r = [], re = /(\d{1,2})\s*h\s*(\d{2})?\s*(?:às|as|a|-|–)\s*(\d{1,2})\s*h\s*(\d{2})?/gi, m;
    while ((m = re.exec(txt))) r.push([+m[1] * 60 + (+m[2] || 0), +m[3] * 60 + (+m[4] || 0)]);
    return r;
  }
  function iso(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function hojeISO() { return iso(new Date()); }
  function dataExtenso(d, comDia) {
    var nome = DIAS_NOME[d.getDay()] + (d.getDay() > 0 && d.getDay() < 6 ? "-feira" : "");
    return (comDia === false ? "" : nome + ", ") + d.getDate() + " de " + MESES[d.getMonth()] + (comDia === "ano" ? " de " + d.getFullYear() : "");
  }
  function codigoInsta(url) {
    var m = String(url).match(/instagram\.com\/(?:[^\/]+\/)?(p|reel|tv)\/([A-Za-z0-9_-]+)/);
    return m ? { tipo: m[1] === "tv" ? "p" : m[1], id: m[2] } : null;
  }

  /* ================= ícones e ilustrações ================= */
  var I = {
    relogio: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    gota: '<path d="M12 3s6 6.6 6 11a6 6 0 0 1-12 0c0-4.4 6-11 6-11z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/>',
    pino: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    livro: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/><path d="M12 7v6M9 10h6"/>',
    casa: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',
    sino: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
    coracao: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    fone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    conversa: '<path d="M4 20l1.4-4A8 8 0 1 1 8 19z"/><path d="M9.5 9.5c.3 2 2 3.7 4 4l1.2-1.1 1.8.8-.4 1.5c-3.3.2-6.6-3.1-6.4-6.4l1.5-.4.8 1.8z"/>',
    email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    seta: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    esquerda: '<path d="M15 6l-6 6 6 6"/>',
    direita: '<path d="M9 6l6 6-6 6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    copiar: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/>',
    aliancas: '<circle cx="9" cy="14" r="5"/><circle cx="15" cy="14" r="5"/><path d="M10.5 6.5L12 4l1.5 2.5"/>',
    cruz: '<path d="M12 3v18M7 8h10"/>',
    calendario: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    pessoas: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.2a5 5 0 0 1 5.5 5.8"/>',
    peixe: '<path d="M3 12c3-5 9-6 13-2l5-3v10l-5-3c-4 4-10 3-13-2z"/><circle cx="8" cy="11" r=".8" fill="currentColor"/>',
  };
  function icone(n) {
    return '<svg class="icone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (I[n] || "") + "</svg>";
  }
  function chaves(c1, c2, w) {
    w = w || 5;
    return '<g fill="none" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round">' +
      '<g transform="rotate(45 50 50)" stroke="' + c1 + '"><circle cx="50" cy="25" r="9"/><line x1="50" y1="34" x2="50" y2="80"/><path d="M50 66h9M50 74h11M59 66v8"/></g>' +
      '<g transform="rotate(-45 50 50)" stroke="' + c2 + '"><circle cx="50" cy="25" r="9"/><line x1="50" y1="34" x2="50" y2="80"/><path d="M50 66h-9M50 74h-11M41 66v8"/></g></g>';
  }

  // Barca de Pedro (ilustração da capa)
  function raios() {
    var s = "";
    for (var i = 0; i < 16; i++) {
      var a = (i / 16) * Math.PI * 2, x1 = 240 + Math.cos(a) * 150, y1 = 150 + Math.sin(a) * 150, x2 = 240 + Math.cos(a) * 182, y2 = 150 + Math.sin(a) * 182;
      s += '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '"/>';
    }
    return s;
  }
  var BARCA = '<svg viewBox="0 0 460 400" role="img" aria-label="Barca de Pedro com as chaves na vela, sobre o mar">' +
    '<defs><radialGradient id="halo"><stop offset="0" stop-color="#ffd98a" stop-opacity=".55"/><stop offset=".55" stop-color="#e0a73c" stop-opacity=".18"/><stop offset="1" stop-color="#e0a73c" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="vela" x1="0" x2="1"><stop offset="0" stop-color="#fffaf0"/><stop offset="1" stop-color="#f3e2b8"/></linearGradient>' +
    '<pattern id="redeP" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0H9M0 0V9" stroke="#f6e7c1" stroke-width="1.3" stroke-opacity=".8"/></pattern></defs>' +
    '<circle cx="240" cy="150" r="150" fill="url(#halo)"/>' +
    '<g stroke="#e0a73c" stroke-opacity=".35" stroke-width="2" stroke-linecap="round">' + raios() + "</g>" +
    '<g fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="2.4" stroke-linecap="round"><path d="M70 70q7-8 14 0q7-8 14 0"/><path d="M110 46q5-6 10 0q5-6 10 0"/><path d="M370 92q5-6 10 0q5-6 10 0"/></g>' +
    '<g class="barca">' +
    '<rect x="236" y="66" width="8" height="214" rx="3" fill="#5a321a"/>' +
    '<path d="M244 68L290 79L244 90Z" fill="#b8322a"/>' +
    '<path d="M248 92Q336 170 348 268L248 268Z" fill="url(#vela)" stroke="#e7cf98" stroke-width="2"/>' +
    '<path d="M232 108L232 268L144 268Q168 180 232 108Z" fill="#f1dfb3" stroke="#e7cf98" stroke-width="2"/>' +
    '<g transform="translate(266 168) scale(.62)">' + chaves("#d4972c", "#b8322a", 7) + "</g>" +
    '<path d="M112 270L368 270L364 284L116 284Z" fill="#a8622f"/>' +
    '<path d="M116 282L364 282Q352 322 304 334L176 334Q128 322 116 282Z" fill="#7a4424"/>' +
    '<path d="M140 304L340 304" stroke="#5e331a" stroke-width="2" stroke-opacity=".7"/>' +
    '<path d="M170 284Q158 326 188 356Q214 374 240 354Q228 320 238 286Z" fill="url(#redeP)" stroke="#f6e7c1" stroke-opacity=".75" stroke-width="1.6"/>' +
    '<circle cx="172" cy="290" r="4" fill="#e0a73c"/><circle cx="236" cy="292" r="4" fill="#e0a73c"/>' +
    "</g>" +
    '<g fill="none" stroke="#fff" stroke-linecap="round"><path d="M90 352q20-10 40 0t40 0t40 0t40 0t40 0t40 0t40 0" stroke-opacity=".55" stroke-width="3"/><path d="M60 374q20-10 40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0" stroke-opacity=".3" stroke-width="3"/></g>' +
    '<g class="peixe-pulo"><g transform="translate(320 350)"><path d="M0 0q14-10 28 0q-14 10-28 0z" fill="#e0a73c"/><path d="M28 0l9-7v14z" fill="#e0a73c"/></g></g>' +
    '<g transform="translate(120 382)" opacity=".55"><path d="M0 0q12-8 24 0q-12 8-24 0z" fill="#9cc6ea"/><path d="M24 0l8-6v12z" fill="#9cc6ea"/></g>' +
    "</svg>";

  // Igreja (moldura da história)
  var IGREJA = '<svg viewBox="0 0 320 300" fill="none" stroke="#fbefd2" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true" style="padding:30px">' +
    '<path d="M160 6v34M148 18h24" stroke="#e0a73c" stroke-width="4"/>' +
    '<path d="M60 280V170l100-44 100 44v110z" fill="rgba(255,255,255,.05)"/>' +
    '<path d="M128 92l32-46 32 46z" fill="#123a63"/><rect x="128" y="92" width="64" height="80" fill="#123a63"/>' +
    '<g transform="translate(144 112) scale(.32)">' + chaves("#e0a73c", "#fbefd2", 7) + "</g>" +
    '<path d="M136 280v-58a24 24 0 0 1 48 0v58"/><path d="M84 248v-36a12 12 0 0 1 24 0v36zM212 248v-36a12 12 0 0 1 24 0v36z"/>' +
    '<path d="M30 288h260" stroke="#e0a73c"/></svg>';

  // Ícones grandes dos símbolos de São Pedro
  var SIMB = {
    chaves: '<svg viewBox="0 0 100 100" aria-hidden="true">' + chaves("#e0a73c", "#f6e7c1", 6) + "</svg>",
    barca: '<svg viewBox="0 0 64 64" fill="none" stroke="#e0a73c" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 42h48l-6 10H14z"/><path d="M32 8v34"/><path d="M35 12c10 8 14 18 14 27H35z" fill="rgba(246,231,193,.2)"/><path d="M29 16c-7 6-11 14-12 23h12z"/><path d="M4 59c6-3 10-3 16 0s10 3 16 0 10-3 16 0 6 2 8 1" stroke="#9cc6ea"/></svg>',
    rede: '<svg viewBox="0 0 64 64" fill="none" stroke="#e0a73c" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 12h44l-6 40H16z"/><path d="M14 22h36M15 32h34M16 42h32M21 12l4 40M32 12v40M43 12l-4 40" stroke-opacity=".8"/><circle cx="10" cy="12" r="3" fill="#b8322a" stroke="none"/><circle cx="54" cy="12" r="3" fill="#b8322a" stroke="none"/><path d="M26 28q4-3 8 0q-4 3-8 0zM34 28l3-2v4" stroke="#f6e7c1"/></svg>',
    pedra: '<svg viewBox="0 0 64 64" fill="none" stroke="#e0a73c" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 56c2-10 10-16 20-16h12c10 0 18 6 20 16z" fill="rgba(246,231,193,.15)"/><path d="M24 40V27l8-8 8 8v13"/><path d="M32 6v9M28 10h8"/><path d="M29 40v-6h6v6"/></svg>',
  };

  // Ondas animadas
  function caminhoOnda(base, amp, periodo, largura) {
    var d = "M0 " + base;
    for (var x = 0; x < largura; x += periodo) d += " C" + (x + periodo * .25) + " " + (base - amp) + " " + (x + periodo * .75) + " " + (base + amp) + " " + (x + periodo) + " " + base;
    return d + " L" + largura + " 140 L0 140 Z";
  }
  function ondas(corFrente) {
    function camada(cls, cor, base, amp, per) {
      return '<svg class="' + cls + '" viewBox="0 0 2880 140" preserveAspectRatio="none" aria-hidden="true"><path fill="' + cor + '" d="' + caminhoOnda(base, amp, per, 2880) + '"/></svg>';
    }
    return '<div class="ondas">' + camada("o1", "#ffffff", 60, 22, 720) + camada("o2", "#9cc6ea", 78, 18, 480) + camada("o3", corFrente || "#fbf8f2", 96, 14, 960) + "</div>";
  }
  function divisor(cor, virado) {
    return '<svg class="divisor' + (virado ? " virado" : "") + '" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true"><path fill="' + cor + '" d="M0 30 C240 60 480 0 720 30 S1200 60 1440 30 L1440 60 L0 60Z"/></svg>';
  }
  function bandeirinhas() {
    var cores = ["#fbefd2", "#1f6aa5", "#e0a73c", "#ffffff", "#0c2340"], s = "";
    for (var i = 0; i < 60; i++) s += '<path d="M' + (i * 34) + ' 4 L' + (i * 34 + 30) + ' 4 L' + (i * 34 + 15) + ' 24 Z" fill="' + cores[i % cores.length] + '" opacity=".9"/>';
    return '<svg class="festa-bandeirinhas" viewBox="0 0 2040 26" preserveAspectRatio="xMinYMin slice" aria-hidden="true"><path d="M0 4H2040" stroke="#fff" stroke-opacity=".7"/>' + s + "</svg>";
  }

  /* ================= liturgia (API pública) ================= */
  var CORES_LIT = { branco: "#f4efe2", verde: "#2e7d32", roxo: "#6a1b9a", vermelho: "#c62828", rosa: "#e07ba0", preto: "#222222", dourado: "#d4a017" };
  function corLit(nome) { var n = norm(nome); for (var k in CORES_LIT) if (n.indexOf(k) > -1) return CORES_LIT[k]; return "#e0a73c"; }
  function buscarLiturgia(d) {
    var chave = "lit-" + iso(d);
    try { var c = sessionStorage.getItem(chave); if (c) return Promise.resolve(JSON.parse(c)); } catch (e) {}
    var url = API_LITURGIA + "?dia=" + d.getDate() + "&mes=" + (d.getMonth() + 1) + "&ano=" + d.getFullYear();
    var ctrl = window.AbortController ? new AbortController() : null;
    var t = setTimeout(function () { if (ctrl) ctrl.abort(); }, 12000);
    return fetch(url, ctrl ? { signal: ctrl.signal } : {}).then(function (r) {
      clearTimeout(t);
      if (!r.ok) throw new Error("http " + r.status);
      return r.json();
    }).then(function (j) {
      if (!j || !j.leituras) throw new Error("vazio");
      try { sessionStorage.setItem(chave, JSON.stringify(j)); } catch (e) {}
      return j;
    });
  }
  function textoBiblico(t) {
    return esc(t).replace(/(^|[\s“"(—–])(\d{1,3})(?=[A-Za-zÀ-ÿ“"«(])/g, "$1<sup>$2</sup>");
  }
  function semNumeros(t) { return String(t || "").replace(/(^|[\s“"(—–])\d{1,3}(?=[A-Za-zÀ-ÿ“"«(])/g, "$1"); }

  /* ================= topo e rodapé ================= */
  var MENU = [
    ["paroquia", "paroquia.html", "A Paróquia"],
    ["horarios", "horarios.html", "Horários"],
    ["liturgia", "liturgia.html", "Liturgia Diária"],
    ["sacramentos", "sacramentos.html", "Sacramentos"],
    ["comunidades", "comunidades.html", "Comunidades"],
    ["avisos", "avisos.html", "Avisos"],
    ["casa-de-formacao", "casa-de-formacao.html", "Casa de Formação"],
    ["contato", "contato.html", "Contato"],
  ];
  function marca() {
    return '<a class="marca" href="index.html">' +
      (S.imagens && S.imagens.logo ? '<img src="' + esc(S.imagens.logo) + '" alt="" width="48" height="48">' : "") +
      "<div><strong>" + esc(P.nome) + "</strong><span>" + esc(P.local) + "</span></div></a>";
  }
  function redesLinks() {
    var r = S.redes || {}, out = [];
    if (r.instagram) out.push("<a" + ext(r.instagram) + ">Instagram</a>");
    if (r.facebook) out.push("<a" + ext(r.facebook) + ">Facebook</a>");
    if (r.youtube) out.push("<a" + ext(r.youtube) + ">YouTube</a>");
    return out;
  }
  function topo() {
    var faixa = '<div class="faixa"><div class="container"><span id="faixa-lit">' + esc(P.arquidiocese) + "</span>" +
      '<span class="faixa-redes">' + redesLinks().join("") + "</span></div></div>";
    var itens = MENU.map(function (m) {
      return '<li><a href="' + m[1] + '"' + (m[0] === "liturgia" ? ' class="menu-liturgia"' : "") + (m[0] === pagina ? ' aria-current="page"' : "") + ">" + m[2] + "</a></li>";
    }).join("");
    return '<a class="pular" href="#conteudo">Pular para o conteúdo</a>' + faixa +
      '<header class="topo"><div class="container">' + marca() +
      '<button class="menu-botao" aria-expanded="false" aria-controls="menu">' + icone("menu") + "Menu</button>" +
      '<nav aria-label="Principal"><ul class="menu" id="menu">' + itens + "</ul></nav></div></header>";
  }
  function blocoPix() {
    var d = S.doacoes || {};
    if (!d.pix) return "";
    return "<p>" + esc(d.texto) + "</p>" +
      '<div class="pix"><span>PIX:</span><code>' + esc(d.pix) + "</code>" +
      '<button class="botao botao-ouro botao-pequeno" data-copiar="' + esc(d.pix) + '">' + icone("copiar") + "Copiar</button></div>" +
      (d.favorecido ? '<p style="margin-top:10px;font-size:.88rem;opacity:.85">Favorecido: ' + esc(d.favorecido) + "</p>" : "");
  }
  function rodape() {
    var sec = lista(S.secretaria).map(function (s) { return "<li><strong>" + esc(s.dias) + ":</strong> " + esc(s.horario) + "</li>"; }).join("");
    var c = [];
    if (P.endereco) c.push("<li><a" + ext(mapsLink(P.endereco)) + ">" + esc(P.endereco) + "</a></li>");
    if (P.telefone) c.push('<li>Telefone: <a href="' + telLink(P.telefone) + '">' + esc(P.telefone) + "</a></li>");
    if (P.whatsapp) c.push("<li>WhatsApp: <a" + ext(wppLink(P.whatsapp)) + ">" + esc(P.whatsappTexto || P.whatsapp) + "</a></li>");
    if (P.email) c.push('<li><a href="mailto:' + esc(P.email) + '">' + esc(P.email) + "</a></li>");
    var d = S.doacoes || {};
    var nav = [["inicio", "index.html", "Início"]].concat(MENU);
    return divisor("#0c2340").replace('class="divisor"', 'class="rodape-onda"') +
      '<footer class="rodape"><div class="container"><div class="grade">' +
      "<div>" + marca() + '<p class="rodape-verso">“Tu és Pedro, e sobre esta pedra edificarei a minha Igreja.” <small style="opacity:.7">Mt 16,18</small></p><ul>' + c.join("") + "</ul></div>" +
      "<div><h3>Secretaria paroquial</h3><ul>" + sec + "</ul>" +
      '<h3 style="margin-top:22px">Siga a paróquia</h3><ul>' + redesLinks().map(function (l) { return "<li>" + l + "</li>"; }).join("") + "</ul></div>" +
      "<div>" + (d.pix ? "<h3>Dízimo e ofertas</h3>" + blocoPix() : "<h3>Navegue</h3><ul>" + nav.map(function (m) { return '<li><a href="' + m[1] + '">' + m[2] + "</a></li>"; }).join("") + "</ul>") + "</div>" +
      '</div><div class="rodape-fim"><span>© ' + new Date().getFullYear() + " " + esc(P.nome) + "</span><span>" + esc(P.arquidiocese) + "</span></div></div></footer>" +
      (P.whatsapp ? '<a class="wpp-flutuante"' + ext(wppLink(P.whatsapp, "Olá! Vim pelo site da paróquia.")) + ' aria-label="Falar com a secretaria no WhatsApp">' + icone("conversa").replace('class="icone"', "") + "</a>" : "");
  }
  function tituloPagina(titulo, texto) {
    return '<section class="titulo-pagina"><svg class="marca-dagua" viewBox="0 0 100 100" aria-hidden="true">' + chaves("#e0a73c", "#ffffff", 5) + "</svg>" +
      '<div class="container"><div class="migalha"><a href="index.html">Início</a> › ' + esc(titulo) + "</div>" +
      "<h1>" + esc(titulo) + "</h1>" + (texto ? "<p>" + esc(texto) + "</p>" : "") + "</div>" + ondas() + "</section>";
  }
  function cabecalho(olho, titulo, texto, extra) {
    return '<div class="cabecalho-secao revelar"><div>' + (olho ? '<span class="olho">' + esc(olho) + "</span>" : "") +
      "<h2>" + titulo + "</h2>" + (texto ? "<p>" + esc(texto) + "</p>" : "") + "</div>" + (extra || "") + "</div>";
  }

  /* ================= blocos reutilizáveis ================= */
  function proximaMissa() {
    var agora = new Date(), hoje = agora.getDay(), min = agora.getHours() * 60 + agora.getMinutes(), porDia = {};
    lista(S.missas).forEach(function (m) { var i = indiceDia(m.dia); if (i > -1) porDia[i] = (porDia[i] || []).concat(lista(m.horas)); });
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
    var agora = new Date(), d = agora.getDay(), min = agora.getHours() * 60 + agora.getMinutes(), hojeTxt = "";
    var aberta = lista(S.secretaria).some(function (s) {
      if (parseDias(s.dias).indexOf(d) === -1) return false;
      hojeTxt = s.horario;
      return intervalos(s.horario).some(function (iv) { return min >= iv[0] && min < iv[1]; });
    });
    return { aberta: aberta, hoje: hojeTxt };
  }
  function faixaHoje() {
    var agora = new Date(), pm = proximaMissa(), st = statusSecretaria();
    return '<div class="container"><div class="hoje revelar" aria-label="Hoje na paróquia">' +
      '<div><div class="rotulo">' + icone("calendario") + 'Hoje</div><div class="valor">' + esc(dataExtenso(agora)) + '</div><div class="detalhe" id="hoje-lit"><a href="liturgia.html">Ler a liturgia do dia</a></div></div>' +
      '<div><div class="rotulo">' + icone("relogio") + 'Próxima missa na Matriz</div><div class="valor">' + (pm ? esc(pm.quando + ", " + pm.hora) : "Consulte") + '</div><div class="detalhe"><a href="horarios.html">Ver todos os horários</a></div></div>' +
      '<div><div class="rotulo">' + icone("conversa") + 'Secretaria</div><div class="valor"><span class="status' + (st.aberta ? " aberta" : "") + '">' + (st.aberta ? "Aberta agora" : "Fechada agora") + "</span></div>" +
      '<div class="detalhe">' + (st.hoje ? "Hoje: " + esc(st.hoje) : "Hoje não abre") + "</div></div></div></div>";
  }
  function faixaVersos() {
    var v = lista(S.versiculos);
    if (!v.length) return "";
    var um = v.map(function (x) { return "<span>" + esc(x.frase) + " <small>" + esc(x.ref) + '</small></span><span class="sep" aria-hidden="true">✦</span>'; }).join("");
    return '<div class="versos" aria-label="Palavras de São Pedro"><div class="versos-trilho">' + um + '<span aria-hidden="true" style="display:contents">' + um + "</span></div></div>";
  }
  function destaquesAtivos() { var h = hojeISO(); return lista(S.destaques).filter(function (d) { return !d.ate || d.ate >= h; }); }
  function cartoesDestaques(itens) {
    return itens.map(function (d) {
      var bts = [];
      if (d.link) bts.push('<a class="botao botao-vermelho botao-pequeno"' + ext(d.link) + ">" + esc(d.linkTexto || "Saiba mais") + "</a>");
      if (d.link2) bts.push('<a class="botao botao-linha botao-pequeno"' + ext(d.link2) + ">" + esc(d.link2Texto || "Saiba mais") + "</a>");
      return '<article class="cartao destaque revelar">' + (d.data ? '<span class="quando">' + esc(d.data) + "</span>" : "") +
        "<h3>" + esc(d.titulo) + "</h3><p>" + esc(d.texto) + "</p>" + (bts.length ? '<div class="botoes">' + bts.join("") + "</div>" : "") + "</article>";
    }).join("");
  }
  function gradeInsta(qtd) {
    var posts = lista(S.instagramPosts).map(codigoInsta).filter(Boolean).slice(0, qtd || 99);
    if (!posts.length) return '<p class="vazio">Nenhum post selecionado ainda.</p>';
    return '<div class="insta-grade">' + posts.map(function (p) {
      return '<iframe class="revelar" src="https://www.instagram.com/' + p.tipo + "/" + esc(p.id) + '/embed/captioned/" loading="lazy" title="Publicação do Instagram da paróquia" scrolling="no"></iframe>';
    }).join("") + "</div>";
  }
  function cartoesComunidades(itens) {
    return itens.map(function (c) {
      return '<article class="cartao comunidade revelar' + (c.destaque ? " principal" : "") + '"><span class="bairro">' + icone("pino") + esc(c.bairro) + "</span>" +
        "<h3>" + esc(c.nome) + "</h3>" + (c.endereco ? "<p>" + esc(c.endereco) + "</p>" : "") +
        '<div class="botoes"><a class="botao botao-linha botao-pequeno"' + ext(mapsLink(c.busca || c.endereco || c.bairro)) + ">Como chegar " + icone("seta") + "</a></div></article>";
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
  function cartoesClero() {
    return lista(S.clero).map(function (c) {
      var ini = String(c.nome || "").replace(/^(pe\.?|padre|diác\.?|diacono|dom)\s+/i, "").split(/\s+/).filter(Boolean);
      ini = (ini[0] ? ini[0][0] : "") + (ini.length > 1 ? ini[ini.length - 1][0] : "");
      return '<div class="cartao pessoa revelar"><div class="avatar">' + (c.foto ? '<img src="' + esc(c.foto) + '" alt="' + esc(c.nome) + '">' : esc(ini)) + '</div><span class="cargo">' + esc(c.cargo) + "</span><h3>" + esc(c.nome) + "</h3></div>";
    }).join("");
  }
  function secaoSimbolos(comCitacao) {
    var itens = [
      ["chaves", "As chaves", "Jesus confiou a Pedro as chaves do Reino: sinal de serviço, de cuidado e de unidade da Igreja.", "Mt 16,19"],
      ["barca", "A barca", "Pedro era pescador da Galileia. A sua barca é imagem da Igreja, que navega unida e guiada por Cristo.", "Lc 5,3"],
      ["rede", "A rede", "“Lançai as redes”: a missão de anunciar o Evangelho e acolher a todos, sem deixar ninguém de fora.", "Lc 5,4-6"],
      ["pedra", "A pedra", "Pedro quer dizer pedra: a fé firme sobre a qual Cristo edifica a Igreja. Não por acaso, estamos em Venda das Pedras!", "Mt 16,18"],
    ];
    return '<section class="secao secao-noite"><div class="container simbolos"><div class="revelar">' +
      '<span class="olho">Nosso padroeiro</span><h2>Quem foi São Pedro?</h2>' +
      "<p>Simão, pescador de Cafarnaum, deixou as redes para seguir Jesus. Recebeu o nome de Pedro, tornou-se o primeiro entre os apóstolos e o primeiro Papa da Igreja. Era impulsivo, generoso e humano: caiu, chorou, foi perdoado e deu a vida por Cristo em Roma.</p>" +
      (comCitacao !== false ? '<p class="citacao-grande">“Senhor, tu sabes tudo; <span>tu sabes que eu te amo.</span>”</p><p style="margin:0;color:var(--ouro);font-weight:700">Jo 21,17</p>' : "") +
      (pagina === "inicio" ? '<div class="botoes" style="margin-top:26px"><a class="botao botao-ouro" href="paroquia.html">Conheça a nossa história</a></div>' : "") +
      '</div><div class="simbolos-grade">' + itens.map(function (s) {
        return '<div class="simbolo-cartao revelar">' + SIMB[s[0]] + "<h3>" + s[1] + "</h3><p>" + s[2] + "</p><cite>" + s[3] + "</cite></div>";
      }).join("") + "</div></div></section>";
  }
  function cartaoFesta() {
    var f = S.festa;
    if (!f || !f.data) return "";
    var md = String(f.data).split("-"), hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    var alvo = new Date(hoje.getFullYear(), +md[0] - 1, +md[1]);
    if (alvo < hoje) alvo = new Date(hoje.getFullYear() + 1, +md[0] - 1, +md[1]);
    var dias = Math.round((alvo - hoje) / 864e5);
    return '<section class="secao" style="padding-bottom:20px"><div class="container"><div class="festa revelar">' + bandeirinhas() +
      '<div class="festa-numero">' + (dias === 0 ? "<strong>🎉</strong><span>É hoje!</span>" : "<strong>" + dias + "</strong><span>" + (dias === 1 ? "dia" : "dias") + "</span>") + "</div>" +
      "<div><span class=\"olho\" style=\"color:#fff\">" + esc(dataExtenso(alvo, false)) + "</span><h2>" + (dias === 0 ? "Hoje é dia de São Pedro!" : "Falta pouco para a " + esc(f.titulo)) + "</h2><p>" + esc(f.texto) + "</p></div>" +
      (S.redes && S.redes.instagram ? '<div class="botoes"><a class="botao botao-ouro"' + ext(S.redes.instagram) + ">Acompanhar novidades</a></div>" : "") +
      "</div></div></section>";
  }

  /* ================= páginas ================= */
  var paginas = {};

  paginas.inicio = function () {
    var img = S.imagens || {};
    var capa = '<section class="capa">' + (img.capa ? '<img class="capa-foto" src="' + esc(img.capa) + '" alt="">' : "") +
      '<div class="container"><div>' +
      '<div class="selo">' + (img.logo ? '<img src="' + esc(img.logo) + '" alt="">' : "") + esc(P.arquidiocese) + "</div>" +
      "<h1>Paróquia <em>São Pedro</em> Apóstolo</h1>" +
      (P.frase ? '<p class="frase">“' + esc(P.frase) + '”</p>' : "") +
      '<p class="texto">' + esc(P.apresentacao) + "</p>" +
      '<div class="botoes"><a class="botao botao-ouro" href="horarios.html">' + icone("relogio") + "Horários de missa</a>" +
      '<a class="botao botao-claro" href="liturgia.html">' + icone("livro") + "Liturgia de hoje</a></div></div>" +
      '<div class="capa-arte">' + BARCA + "</div></div>" + ondas() + "</section>";

    var evangelho = '<section class="secao" style="padding-top:64px"><div class="container"><div class="evangelho revelar" id="evangelho-dia">' +
      '<div class="evangelho-lado"><span class="olho">Palavra de Deus</span><h2>Evangelho do dia</h2><p class="liturgia-nome" id="ev-liturgia">Carregando a liturgia…</p><p id="ev-cor"></p>' +
      '<div class="botoes" style="margin-top:20px"><a class="botao botao-ouro" href="liturgia.html">Ler a liturgia completa</a></div></div>' +
      '<div class="evangelho-texto"><span class="ref" id="ev-ref">' + icone("livro") + '</span><blockquote id="ev-texto"><div class="carregando"><div></div><div></div><div style="width:70%"></div></div></blockquote></div>' +
      "</div></div></section>";

    var dest = destaquesAtivos();
    var blocoDest = dest.length ? '<section class="secao secao-rede"><div class="container">' +
      cabecalho("Agenda", "Acontece na paróquia", "", '<a class="botao botao-linha botao-pequeno" href="avisos.html">Todos os avisos ' + icone("seta") + "</a>") +
      '<div class="grade grade-3">' + cartoesDestaques(dest.slice(0, 3)) + "</div></div></section>" : "";

    var atalhos = [
      ["horarios.html", "relogio", "tom-ouro", "Missas e confissões", "Horários da Matriz e atendimento de confissões."],
      ["liturgia.html", "livro", "tom-vermelho", "Liturgia diária", "Leituras, salmo e Evangelho do dia, aqui no site."],
      ["sacramentos.html", "gota", "tom-mar", "Sacramentos", "Batismo, casamento, catequese e documentos."],
      ["comunidades.html", "pino", "tom-noite", "Comunidades", lista(S.comunidades).length + " igrejas e comunidades para você participar."],
    ];
    var blocoAtalhos = '<section class="secao"><div class="container">' + cabecalho("Serviços", "Como podemos ajudar?", "") + '<div class="grade grade-4">' +
      atalhos.map(function (a) {
        return '<a class="cartao atalho revelar" href="' + a[0] + '"><span class="simbolo ' + a[2] + '">' + icone(a[1]) + "</span><h3>" + a[3] + "</h3><p>" + esc(a[4]) + '</p><span class="seta">Acessar ' + icone("seta") + "</span></a>";
      }).join("") + "</div></div></section>";

    var clero = lista(S.clero).length ? '<section class="secao secao-branca"><div class="container">' +
      cabecalho("Pastores", "Nossos padres", "Os sacerdotes que servem a nossa comunidade.", '<a class="botao botao-linha botao-pequeno" href="paroquia.html">Conheça a paróquia</a>') +
      '<div class="grade grade-3">' + cartoesClero() + "</div></div></section>" : "";

    var blocoInsta = lista(S.instagramPosts).length ? '<section class="secao"><div class="container">' +
      cabecalho("Avisos", "Últimas do nosso Instagram", "Acompanhe avisos, eventos e a vida da paróquia.",
        S.redes && S.redes.instagram ? '<a class="botao botao-azul botao-pequeno"' + ext(S.redes.instagram) + ">Seguir @s.pedroapostolo</a>" : "") +
      gradeInsta(3) + "</div></section>" : "";

    var com = lista(S.comunidades);
    var blocoCom = divisor("#1b5d93") + '<section class="secao secao-mar"><div class="container">' +
      cabecalho("Comunidades", "Uma barca, muitas comunidades", "Encontre a igreja mais perto de você.", '<a class="botao botao-claro botao-pequeno" href="comunidades.html">Ver todas</a>') +
      '<div class="grade grade-3">' + cartoesComunidades(com.slice(0, 3)) + "</div></div></section>" + divisor("#123a63", true);

    var anos = new Date().getFullYear();
    var blocoSobre = '<section class="secao"><div class="container sobre"><div class="revelar">' +
      '<span class="olho">Nossa história</span><h2>Mais de cem anos de fé em Venda das Pedras</h2>' +
      "<p>Tudo começou em 1919, quando os católicos do bairro decidiram construir uma pequena capela. Ela foi inaugurada em 1921 e, em 1970, tornou-se paróquia. Hoje somos uma família de comunidades unida pela fé, pela Palavra e pela Eucaristia.</p>" +
      '<div class="numeros"><div><strong>' + (anos - 1921) + "</strong><span>anos desde a primeira missa</span></div>" +
      "<div><strong>" + (anos - 1970) + "</strong><span>anos como paróquia</span></div>" +
      "<div><strong>" + com.length + "</strong><span>igrejas e comunidades</span></div></div>" +
      '<div class="botoes" style="margin-top:26px"><a class="botao botao-linha" href="paroquia.html">Conheça a nossa história</a></div></div>' +
      '<div class="moldura revelar">' + (img.historia ? '<img src="' + esc(img.historia) + '" alt="Igreja de São Pedro Apóstolo">' : IGREJA) + "</div></div></section>";

    var d = S.doacoes || {};
    var blocoDizimo = d.pix ? '<section class="secao secao-noite chamada"><div class="container"><span class="olho">Dízimo e ofertas</span><h2>Faça parte desta missão</h2>' + blocoPix() + "</div></section>" : "";

    return capa + faixaHoje() + faixaVersos() + evangelho + blocoDest + blocoAtalhos + secaoSimbolos() + cartaoFesta() + clero + blocoInsta + blocoCom + blocoSobre + blocoDizimo;
  };

  paginas.paroquia = function () {
    var tempo = lista(S.historia).map(function (h) { return '<li class="revelar"><span class="ano">' + esc(h.ano) + "</span><p>" + esc(h.texto) + "</p></li>"; }).join("");
    var past = lista(S.pastorais).map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("");
    var img = (S.imagens || {}).historia;
    return tituloPagina("A Paróquia", P.apresentacao) +
      (lista(S.clero).length ? '<section class="secao"><div class="container">' + cabecalho("Pastores", "Nossos padres", "Os sacerdotes que servem a nossa comunidade.") + '<div class="grade grade-3">' + cartoesClero() + "</div></div></section>" : "") +
      secaoSimbolos() +
      '<section class="secao"><div class="container sobre" style="align-items:start"><div>' +
      '<span class="olho">Linha do tempo</span><h2>Nossa história</h2><ol class="tempo">' + tempo + "</ol></div>" +
      '<div class="moldura revelar" style="position:sticky;top:110px">' + (img ? '<img src="' + esc(img) + '" alt="Igreja de São Pedro Apóstolo">' : IGREJA) + "</div></div></section>" +
      (past ? '<section class="secao secao-branca"><div class="container">' + cabecalho("Participe", "Pastorais e movimentos", "Há um lugar para você servir. Procure a secretaria para saber dias e horários de cada grupo.") + '<ul class="chips revelar">' + past + "</ul></div></section>" : "");
  };

  paginas.horarios = function () {
    var conf = lista(S.confissoes).map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("");
    var sec = lista(S.secretaria).map(function (s) { return '<li><span class="dia">' + esc(s.dias) + '</span><span class="horas"><span class="hora">' + esc(s.horario) + "</span></span></li>"; }).join("");
    var st = statusSecretaria();
    return tituloPagina("Horários", "Missas, confissões e atendimento da secretaria paroquial.") +
      '<section class="secao" style="padding-top:40px"><div class="container grade grade-2" style="align-items:start"><div class="revelar">' +
      '<span class="olho">Igreja Matriz</span><h2>Santas Missas</h2>' + listaHorarios() +
      (S.missasObservacao ? '<p class="nota" style="margin-top:16px">' + esc(S.missasObservacao) + "</p>" : "") +
      '<p style="margin-top:16px">Para horários das comunidades, veja a página <a href="comunidades.html">Comunidades</a> ou fale com a secretaria.</p></div>' +
      '<div class="revelar">' + (conf ? '<span class="olho">Reconciliação</span><h2>Confissões</h2><div class="cartao"><ul class="lista">' + conf + "</ul></div>" : "") +
      '<div style="margin-top:36px"><span class="olho">Atendimento</span><h2>Secretaria</h2></div><ul class="horarios">' + sec + "</ul>" +
      '<p style="margin-top:12px;font-weight:700"><span class="status' + (st.aberta ? " aberta" : "") + '">' + (st.aberta ? "Aberta agora" : "Fechada agora") + "</span></p>" +
      (P.whatsapp ? '<div class="botoes"><a class="botao botao-wpp"' + ext(wppLink(P.whatsapp, "Olá! Vim pelo site da paróquia.")) + ">" + icone("conversa") + "WhatsApp da secretaria</a></div>" : "") +
      "</div></div></section>";
  };

  paginas.liturgia = function () {
    return tituloPagina("Liturgia Diária", "Leituras, salmo e Evangelho de cada dia, para rezar com a Igreja.") +
      '<section class="secao" style="padding-top:0"><div class="container" style="max-width:920px">' +
      '<div class="lit-controles"><div class="grupo">' +
      '<button type="button" data-lit="-1" aria-label="Dia anterior">' + icone("esquerda") + "</button>" +
      '<input type="date" id="lit-data" aria-label="Escolher data">' +
      '<button type="button" data-lit="1" aria-label="Próximo dia">' + icone("direita") + "</button>" +
      '<button type="button" class="hoje-btn" data-lit="hoje">Hoje</button></div>' +
      '<div class="grupo"><span style="font-size:.85rem;color:var(--suave);font-weight:600">Letra</span>' +
      '<button type="button" data-fonte="-1" aria-label="Diminuir letra">A−</button><button type="button" data-fonte="1" aria-label="Aumentar letra">A+</button></div></div>' +
      '<div id="lit-conteudo" aria-live="polite"></div></div></section>';
  };

  paginas.sacramentos = function () {
    function ic(t) { var n = norm(t); return n.indexOf("batis") > -1 ? ["gota", "tom-mar"] : n.indexOf("matrim") > -1 || n.indexOf("casam") > -1 ? ["aliancas", "tom-ouro"] : n.indexOf("catequ") > -1 ? ["livro", "tom-vermelho"] : n.indexOf("un") === 0 ? ["coracao", "tom-noite"] : ["cruz", "tom-ouro"]; }
    var itens = lista(S.sacramentos).map(function (s, i) {
      var ls = lista(s.listas).map(function (l) { return "<h4>" + esc(l.nome) + '</h4><ul class="lista">' + lista(l.itens).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>"; }).join("");
      var c = ic(s.titulo);
      return '<details class="sacramento revelar"' + (i === 0 ? " open" : "") + '><summary><span class="simbolo ' + c[1] + '">' + icone(c[0]) + "</span>" + esc(s.titulo) + '</summary><div class="corpo"><p>' + esc(s.resumo) + "</p>" + ls + "</div></details>";
    }).join("");
    return tituloPagina("Sacramentos", "Documentos e orientações para receber os sacramentos na nossa paróquia.") +
      '<section class="secao" style="padding-top:40px"><div class="container" style="max-width:880px">' + itens +
      '<p class="nota">Ficou com dúvida? A secretaria ajuda você com tudo. ' + (P.whatsapp ? "<a" + ext(wppLink(P.whatsapp, "Olá! Tenho uma dúvida sobre sacramentos.")) + ">Chame no WhatsApp</a>." : "") + "</p></div></section>";
  };

  paginas.comunidades = function () {
    var c = lista(S.comunidades);
    return tituloPagina("Comunidades", "A Paróquia São Pedro Apóstolo é formada pela Igreja Matriz e por comunidades em vários bairros de Itaboraí.") +
      '<section class="secao" style="padding-top:40px"><div class="container"><div class="grade grade-3">' + cartoesComunidades(c) + "</div>" +
      '<p class="nota" style="margin-top:26px">Os horários de missa de cada comunidade são divulgados nos avisos e no nosso Instagram.</p></div></section>' +
      '<section class="secao secao-branca"><div class="container">' + cabecalho("Mapa", "Igreja Matriz", P.endereco) +
      '<iframe class="mapa" loading="lazy" title="Mapa da Igreja Matriz" src="https://www.google.com/maps?q=' + encodeURIComponent((c[0] && c[0].busca) || P.endereco) + '&output=embed"></iframe></div></section>';
  };

  paginas.avisos = function () {
    var dest = destaquesAtivos();
    return tituloPagina("Avisos e eventos", "O que está acontecendo na paróquia e nas comunidades.") +
      (dest.length ? '<section class="secao" style="padding-top:40px"><div class="container">' + cabecalho("Agenda", "Destaques", "") + '<div class="grade grade-3">' + cartoesDestaques(dest) + "</div></div></section>" : "") +
      cartaoFesta() +
      '<section class="secao"><div class="container">' +
      cabecalho("Instagram", "Publicações recentes", "Avisos publicados no @s.pedroapostolo.", S.redes && S.redes.instagram ? '<a class="botao botao-azul botao-pequeno"' + ext(S.redes.instagram) + ">Ver perfil completo</a>" : "") +
      gradeInsta() + "</div></section>" +
      (lista(S.links).length ? '<section class="secao secao-branca"><div class="container">' + cabecalho("Para você", "Links úteis", "") + '<div class="grade grade-3">' +
        lista(S.links).map(function (l) {
          return '<a class="cartao atalho revelar"' + ext(l.url) + '><span class="simbolo tom-vermelho">' + icone("livro") + "</span><h3>" + esc(l.titulo) + "</h3><p>" + esc(l.texto) + '</p><span class="seta">Abrir ' + icone("seta") + "</span></a>";
        }).join("") + "</div></div></section>" : "");
  };

  paginas["casa-de-formacao"] = function () {
    var c = S.casaFormacao || {}, img = (S.imagens || {}).casaFormacao;
    return tituloPagina("Casa de Formação", c.nome) +
      '<section class="secao" style="padding-top:40px"><div class="container sobre" style="align-items:start"><div class="revelar">' +
      '<span class="olho">Retiros e encontros</span><h2>' + esc(c.nome) + "</h2><p>" + esc(c.texto) + "</p>" +
      '<div class="cartao"><h3>Estrutura</h3><ul class="lista">' + lista(c.estrutura).map(function (e) { return "<li>" + esc(e) + "</li>"; }).join("") + "</ul></div>" +
      '<p class="nota" style="margin-top:20px">' + esc(c.reservas) + "</p>" +
      (P.whatsapp ? '<div class="botoes"><a class="botao botao-wpp"' + ext(wppLink(P.whatsapp, "Olá! Gostaria de informações sobre reserva da Casa de Formação.")) + ">" + icone("conversa") + "Consultar reserva</a></div>" : "") +
      '</div><div class="moldura revelar">' + (img ? '<img src="' + esc(img) + '" alt="' + esc(c.nome) + '">' : IGREJA) + "</div></div></section>";
  };

  paginas.contato = function () {
    var cs = [];
    if (P.whatsapp) cs.push(["conversa", "tom-mar", "WhatsApp", P.whatsappTexto || P.whatsapp, wppLink(P.whatsapp, "Olá! Vim pelo site da paróquia."), "Enviar mensagem", true]);
    if (P.telefone) cs.push(["fone", "tom-ouro", "Telefone", P.telefone, telLink(P.telefone), "Ligar"]);
    if (P.email) cs.push(["email", "tom-vermelho", "E-mail", P.email, "mailto:" + P.email, "Escrever"]);
    var sec = lista(S.secretaria).map(function (s) { return "<li><strong>" + esc(s.dias) + ":</strong> " + esc(s.horario) + "</li>"; }).join("");
    return tituloPagina("Contato", "Fale com a secretaria paroquial ou venha nos visitar.") +
      '<section class="secao" style="padding-top:40px"><div class="container"><div class="grade grade-3">' +
      cs.map(function (c) {
        return '<div class="cartao revelar"><span class="simbolo ' + c[1] + '">' + icone(c[0]) + "</span><h3>" + c[2] + '</h3><p style="word-break:break-word">' + esc(c[3]) + '</p><div class="botoes"><a class="botao botao-linha botao-pequeno"' + (c[6] ? ext(c[4]) : ' href="' + esc(c[4]) + '"') + ">" + c[5] + "</a></div></div>";
      }).join("") + "</div></div></section>" +
      '<section class="secao secao-branca"><div class="container grade grade-2" style="align-items:start"><div class="revelar">' +
      '<span class="olho">Endereço</span><h2>Igreja Matriz</h2><p>' + esc(P.endereco) + "</p>" +
      '<div class="botoes" style="margin-bottom:26px"><a class="botao botao-azul"' + ext(mapsLink(P.endereco)) + ">" + icone("pino") + "Abrir no Google Maps</a></div>" +
      '<h3>Horário da secretaria</h3><ul class="lista">' + sec + "</ul></div>" +
      '<iframe class="mapa" loading="lazy" title="Mapa da paróquia" src="https://www.google.com/maps?q=' + encodeURIComponent(P.endereco || P.nome) + '&output=embed"></iframe></div></section>' +
      ((S.doacoes || {}).pix ? '<section class="secao secao-noite chamada"><div class="container"><span class="olho">Dízimo e ofertas</span><h2>Contribua com a paróquia</h2>' + blocoPix() + "</div></section>" : "");
  };

  /* ================= montagem ================= */
  app.innerHTML = topo() + '<main id="conteudo">' + (paginas[pagina] || paginas.inicio)() + "</main>" + rodape();

  var titulos = { paroquia: "A Paróquia", horarios: "Horários", liturgia: "Liturgia Diária", sacramentos: "Sacramentos", comunidades: "Comunidades", avisos: "Avisos", "casa-de-formacao": "Casa de Formação", contato: "Contato" };
  document.title = (titulos[pagina] ? titulos[pagina] + " · " : "") + (P.nome || "Paróquia");

  var botao = app.querySelector(".menu-botao"), menu = app.querySelector("#menu");
  if (botao && menu) botao.addEventListener("click", function () {
    var aberto = menu.classList.toggle("aberto");
    botao.setAttribute("aria-expanded", aberto ? "true" : "false");
  });
  app.addEventListener("click", function (e) {
    var b = e.target.closest("[data-copiar]");
    if (!b || !navigator.clipboard) return;
    navigator.clipboard.writeText(b.getAttribute("data-copiar")).then(function () {
      var o = b.innerHTML; b.textContent = "Copiado!"; setTimeout(function () { b.innerHTML = o; }, 1800);
    }, function () {});
  });

  // Animação de entrada
  var reduz = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduz && "IntersectionObserver" in window) {
    document.documentElement.classList.add("anim");
    var obs = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("visivel"); obs.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -40px 0px" });
    app.querySelectorAll(".revelar").forEach(function (el) { obs.observe(el); });
  }

  // Liturgia do dia na faixa do topo, no "Hoje" e no Evangelho da página inicial
  function mostrarLiturgiaResumo(j) {
    var cor = corLit(j.cor);
    var fl = document.getElementById("faixa-lit");
    if (fl) fl.innerHTML = '<span class="cor-dia"><span class="bolinha-cor" style="background:' + cor + '"></span><a href="liturgia.html">' + esc(j.liturgia) + "</a></span>";
    var hl = document.getElementById("hoje-lit");
    if (hl) hl.innerHTML = '<span style="display:inline-flex;align-items:center;gap:6px"><span class="bolinha-cor" style="background:' + cor + '"></span><a href="liturgia.html">' + esc(j.liturgia) + "</a></span>";
    var ev = (j.leituras && lista(j.leituras.evangelho)[0]) || null;
    if (document.getElementById("evangelho-dia")) {
      document.getElementById("ev-liturgia").textContent = j.liturgia || "";
      document.getElementById("ev-cor").innerHTML = '<span class="cor-tag"><span class="bolinha-cor" style="background:' + cor + '"></span>Cor litúrgica: ' + esc(j.cor || "") + "</span>";
      if (ev) {
        var t = semNumeros(ev.texto), corte = t.length > 380 ? t.slice(0, 380).replace(/\s+\S*$/, "") + "…" : t;
        document.getElementById("ev-ref").innerHTML = icone("livro") + " " + esc(ev.referencia);
        document.getElementById("ev-texto").innerHTML = esc(corte) + '<p style="margin:14px 0 0"><a href="liturgia.html#evangelho"><strong>Continuar lendo</strong></a></p>';
      }
    }
  }
  function erroResumo() {
    var t = document.getElementById("ev-texto");
    if (t) t.innerHTML = 'A liturgia de hoje não carregou agora. <a href="liturgia.html">Tente na página da Liturgia Diária</a>.';
    var l = document.getElementById("ev-liturgia"); if (l) l.textContent = dataExtenso(new Date());
  }
  if (pagina !== "liturgia") buscarLiturgia(new Date()).then(mostrarLiturgiaResumo, erroResumo);

  // Página da liturgia
  if (pagina === "liturgia") {
    var alvo = document.getElementById("lit-conteudo"), campo = document.getElementById("lit-data");
    var params = new URLSearchParams(location.search), data = new Date();
    if (/^\d{4}-\d{2}-\d{2}$/.test(params.get("data") || "")) { var p = params.get("data").split("-"); data = new Date(+p[0], +p[1] - 1, +p[2]); }
    var fonte = 1.08;
    try { fonte = parseFloat(localStorage.getItem("lit-fonte")) || 1.08; } catch (e) {}
    document.documentElement.style.setProperty("--lit-fonte", fonte + "rem");

    function bloco(id, tipo, l, final, cls) {
      return '<article class="leitura ' + (cls || "") + '" id="' + id + '"><span class="tipo">' + tipo + "</span>" +
        (l.titulo ? "<h3>" + esc(l.titulo) + "</h3>" : "") + '<span class="ref">' + esc(l.referencia) + "</span>" +
        '<div class="texto">' + textoBiblico(l.texto) + "</div>" + (final ? '<p class="final">' + final[0] + "<span>" + final[1] + "</span></p>" : "") + "</article>";
    }
    function render(j) {
      var cor = corLit(j.cor), L = j.leituras || {}, out = [], atalhos = [];
      var l1 = lista(L.primeiraLeitura)[0], sl = lista(L.salmo)[0], l2 = lista(L.segundaLeitura)[0], ev = lista(L.evangelho)[0];
      if (j.oracoes && j.oracoes.coleta) out.push('<div class="oracao"><span class="tipo">Oração do dia</span><p>' + esc(j.oracoes.coleta) + "</p></div>");
      if (l1) { atalhos.push(["primeira", "1ª Leitura"]); out.push(bloco("primeira", "Primeira Leitura", l1, ["— Palavra do Senhor.", "Graças a Deus."])); }
      if (sl) {
        atalhos.push(["salmo", "Salmo"]);
        out.push('<article class="leitura" id="salmo"><span class="tipo">Salmo Responsorial</span><h3>' + esc(sl.referencia) + "</h3>" +
          (sl.refrao ? '<div class="refrao"><b>R.</b>' + esc(sl.refrao) + "</div>" : "") + '<div class="texto">' + esc(sl.texto) + "</div></article>");
      }
      if (l2) { atalhos.push(["segunda", "2ª Leitura"]); out.push(bloco("segunda", "Segunda Leitura", l2, ["— Palavra do Senhor.", "Graças a Deus."])); }
      if (ev) { atalhos.push(["evangelho", "Evangelho"]); out.push(bloco("evangelho", "Evangelho", ev, ["— Palavra da Salvação.", "Glória a vós, Senhor."], "evangelho-leitura")); }
      alvo.style.setProperty("--cor-lit", cor);
      alvo.innerHTML = '<div class="lit-cabeca"><div><span class="olho">' + esc(dataExtenso(data, "ano")) + "</span><h2>" + esc(j.liturgia) + "</h2></div>" +
        '<span class="lit-cor"><span class="bolinha-cor" style="background:' + cor + '"></span>Cor litúrgica: ' + esc(j.cor) + "</span></div>" +
        '<nav class="lit-atalhos" aria-label="Ir para">' + atalhos.map(function (a) { return '<a href="#' + a[0] + '">' + a[1] + "</a>"; }).join("") + "</nav>" +
        out.join("") + '<p class="lit-fonte">Textos litúrgicos conforme o Lecionário da CNBB.</p>';
      if (location.hash) { var el = document.getElementById(location.hash.slice(1)); if (el) setTimeout(function () { el.scrollIntoView(); }, 50); }
    }
    function carregar() {
      campo.value = iso(data);
      var q = iso(data) === hojeISO() ? location.pathname : location.pathname + "?data=" + iso(data);
      try { history.replaceState(null, "", q + location.hash); } catch (e) {}
      alvo.innerHTML = '<div class="leitura" style="margin-top:36px"><div class="carregando"><div style="width:40%"></div><div></div><div></div><div style="width:80%"></div><div></div></div></div>';
      buscarLiturgia(data).then(function (j) {
        render(j);
        if (iso(data) === hojeISO()) mostrarLiturgiaResumo(j);
      }, function () {
        alvo.innerHTML = '<div class="leitura" style="margin-top:36px"><h3>Não foi possível carregar a liturgia agora</h3><p>Verifique sua internet e tente de novo em instantes.</p><div class="botoes"><button class="botao botao-azul" type="button" data-lit="recarregar">Tentar de novo</button></div></div>';
      });
    }
    app.addEventListener("click", function (e) {
      var b = e.target.closest("[data-lit],[data-fonte]");
      if (!b) return;
      var v = b.getAttribute("data-lit"), f = b.getAttribute("data-fonte");
      if (f) {
        fonte = Math.min(1.6, Math.max(.95, fonte + (+f) * .08));
        document.documentElement.style.setProperty("--lit-fonte", fonte.toFixed(2) + "rem");
        try { localStorage.setItem("lit-fonte", fonte.toFixed(2)); } catch (er) {}
        return;
      }
      if (v === "hoje") data = new Date();
      else if (v !== "recarregar") data = new Date(data.getFullYear(), data.getMonth(), data.getDate() + (+v));
      carregar();
    });
    campo.addEventListener("change", function () {
      if (!campo.value) return;
      var p = campo.value.split("-"); data = new Date(+p[0], +p[1] - 1, +p[2]); carregar();
    });
    carregar();
  }
})();
