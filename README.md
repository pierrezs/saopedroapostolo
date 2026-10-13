# Site da Paróquia São Pedro Apóstolo

Site da Paróquia São Pedro Apóstolo, em Venda das Pedras, Itaboraí (RJ).
Ele é feito só de arquivos, sem banco de dados e sem mensalidade.

## Como editar

**Todo o conteúdo fica num arquivo só: `conteudo.js`.**
Os outros arquivos você não precisa mexer.

1. Abra o `conteudo.js` (no GitHub: clique no arquivo › ícone de lápis ✏️).
2. Mude os textos que estão entre aspas `"assim"`.
3. Clique em **Commit changes**. Em 1 ou 2 minutos o site atualiza.

### O que dá para mudar

| Quero mudar…                     | Procure no `conteudo.js` |
|----------------------------------|--------------------------|
| Horário de missa                 | `missas`                 |
| Confissões                       | `confissoes`             |
| Horário da secretaria            | `secretaria`             |
| Evento ou aviso em destaque      | `destaques`              |
| Posts do Instagram no site       | `instagramPosts`         |
| Comunidades e endereços          | `comunidades`            |
| Chave PIX do dízimo              | `doacoes`                |
| Padre ou diácono                 | `clero`                  |
| Pastorais                        | `pastorais`              |
| Telefone, WhatsApp, e-mail       | `paroquia`               |
| Contagem da festa do padroeiro   | `festa`                  |
| Frases da faixa vermelha         | `versiculos`             |

### Dicas

- **Não apague** vírgulas, chaves `{ }` nem colchetes `[ ]`.
- Campo vazio `""` faz o bloco sumir do site (ex.: PIX vazio = sem bloco de doação).
- Cada destaque tem a data `ate` (ano-mês-dia). Depois dela, ele **some sozinho**.
- **Posts do Instagram:** no Instagram, abra o post › `⋯` › *Copiar link* e cole na lista `instagramPosts`, sempre o mais novo primeiro.
- **Fotos:** envie a imagem para o GitHub (*Add file › Upload files*), junto dos outros arquivos, e escreva o nome dela em `imagens`, por exemplo `capa: "igreja.jpg"`. Use nomes sem acento e sem espaço.
- Errou e o site ficou em branco? Quase sempre é uma vírgula ou aspas faltando. No GitHub, abra o histórico do arquivo (*History*) e volte para a versão anterior.

## Como publicar no GitHub Pages

1. Crie uma conta em github.com e um repositório novo (ex.: `paroquia-sao-pedro`), marcado como **Public**.
2. Clique em **Add file › Upload files**, selecione **todos os arquivos desta pasta** (são 14, não há subpastas) e clique em **Commit changes**.
3. Vá em **Settings › Pages**. Em *Source* escolha **Deploy from a branch**, branch **main**, pasta **/ (root)** e clique em **Save**.
4. Em 1 ou 2 minutos o site estará em `https://SEU-USUARIO.github.io/paroquia-sao-pedro/`.

Para usar um domínio próprio depois (ex.: `paroquiasaopedro.com.br`), registre no Registro.br e configure em **Settings › Pages › Custom domain**.

## Liturgia diária

A página **Liturgia Diária** busca sozinha as leituras do dia (fonte: Lecionário da CNBB, por meio de uma API pública gratuita). Não precisa atualizar nada. Dá para navegar pelos dias e aumentar a letra.

## Para testar no computador

Basta abrir o arquivo `index.html` no navegador. Os posts do Instagram e o mapa só aparecem com internet.

## Estrutura

Todos os arquivos ficam juntos, sem pastas:

```
index.html            Início
paroquia.html         História, padroeiro, clero e pastorais
horarios.html         Missas, confissões e secretaria
liturgia.html         Liturgia diária (carrega sozinha todos os dias)
sacramentos.html      Batismo, matrimônio, catequese, unção
comunidades.html      Comunidades e mapa
avisos.html           Destaques, posts do Instagram, links úteis
casa-de-formacao.html Casa de Formação Cristã
contato.html          Contato, mapa e dízimo
conteudo.js           ← TODO O CONTEÚDO (edite aqui)
estilo.css            Cores e visual
app.js                Monta as páginas (não precisa mexer)
logo.svg              Logo (chaves de São Pedro)
```
