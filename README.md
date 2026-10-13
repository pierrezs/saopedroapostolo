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

### Dicas

- **Não apague** vírgulas, chaves `{ }` nem colchetes `[ ]`.
- Campo vazio `""` faz o bloco sumir do site (ex.: PIX vazio = sem bloco de doação).
- Cada destaque tem a data `ate` (ano-mês-dia). Depois dela, ele **some sozinho**.
- **Posts do Instagram:** no Instagram, abra o post › `⋯` › *Copiar link* e cole na lista `instagramPosts`, sempre o mais novo primeiro.
- **Fotos:** envie a imagem para a pasta `imagens` (no GitHub: *Add file › Upload files*) e escreva o nome dela em `imagens`, por exemplo `capa: "imagens/igreja.jpg"`.
- Errou e o site ficou em branco? Quase sempre é uma vírgula ou aspas faltando. No GitHub, abra o histórico do arquivo (*History*) e volte para a versão anterior.

## Como publicar no GitHub Pages

1. Crie uma conta em github.com e um repositório novo (ex.: `paroquia-sao-pedro`), marcado como **Public**.
2. Clique em **Add file › Upload files** e arraste **todo o conteúdo desta pasta** (os arquivos `.html`, `conteudo.js` e as pastas `assets` e `imagens`). Clique em **Commit changes**.
3. Vá em **Settings › Pages**. Em *Source* escolha **Deploy from a branch**, branch **main**, pasta **/ (root)** e clique em **Save**.
4. Em 1 ou 2 minutos o site estará em `https://SEU-USUARIO.github.io/paroquia-sao-pedro/`.

Para usar um domínio próprio depois (ex.: `paroquiasaopedro.com.br`), registre no Registro.br e configure em **Settings › Pages › Custom domain**.

## Para testar no computador

Basta abrir o arquivo `index.html` no navegador. Os posts do Instagram e o mapa só aparecem com internet.

## Estrutura

```
index.html            Início
paroquia.html         História, padroeiro, clero e pastorais
horarios.html         Missas, confissões e secretaria
sacramentos.html      Batismo, matrimônio, catequese, unção
comunidades.html      Comunidades e mapa
avisos.html           Destaques, posts do Instagram, links úteis
casa-de-formacao.html Casa de Formação Cristã
contato.html          Contato, mapa e dízimo
conteudo.js           ← TODO O CONTEÚDO (edite aqui)
assets/estilo.css     Cores e visual
assets/app.js         Monta as páginas (não precisa mexer)
imagens/              Logo e fotos
```
