# Instalação
Preferi utilizar o gerenciador de versão *nvm* - *Node Version Manager*. Ele não instala nada
globalmente (como usuário *root* no linux), mantendo os códigos fontes na pasta *home* do usuário.
Veja mais em: <https://github.com/nvm-sh/nvm>

No meu caso, as versões trabalhadas foram as seguintes:
```bash
$ nvm version
v15.4.0
$ nvm current
v15.4.0

$ nvm list
->      v15.4.0
default -> node (-> v15.4.0)
iojs -> N/A (default)
unstable -> N/A (default)
node -> stable (-> v15.4.0) (default)
stable -> 15.4 (-> v15.4.0) (default)
lts/* -> lts/fermium (-> N/A)
lts/argon -> v4.9.1 (-> N/A)
lts/boron -> v6.17.1 (-> N/A)
lts/carbon -> v8.17.0 (-> N/A)
lts/dubnium -> v10.23.0 (-> N/A)
lts/erbium -> v12.20.0 (-> N/A)
lts/fermium -> v14.15.1 (-> N/A)

$ node -v
v15.4.0
```

# Documentação
Usar e abusar de <https://nodejs.org/api/>

**OBS**: Por exemplo, quando usamos *console*, como `console.log`, trata-se de um
[modulo do nodejs](https://nodejs.org/api/console.html), também disponível no console dos
navegadores.

# Módulos nativos (*core modules*)
Na documentação do *nodejs* podemos ver diversos módulos nativos disponíveis para serem importados
e utilizados, como por exemplo o *File System* em `lib/fs.js`.

```javascript
import * as fs from 'fs'
fs.writeFileSync('about_me.txt', 'I live in São Paulo')
```

## Diferença entre *require* e *import*
A inclusão de módulos é feita com `require` do *nodejs* ou com `import` do *ES6* (*ECMAScript 6*
ou mais atual), seja de arquivos separados ou de módulos nativos.

### Com `require`:
Função nativa (*built-in*) do *nodejs*, ou seja, não é disponível no *ES6* isolado como
no console do navegador. Pode ser utilizada para módulos nativos e para locais. Ela basicamente lê
um arquivo JavaScript, executa o arquivo e então retorna o objeto de exportação. <u>Sua execução é
estritamente **síncrona**</u>.

Exemplo:
```javascript
// built-in moduels
const http= require('http')
// local moduels
const getBlogName = require('./blogDetails.js')
```

**OBS**: Para módulos locais é necessário exportá-los usando `modules.export` no arquivo de origem.

```javascript
// on local file blogDetails.js
const getBlogTitle = (name, author) => {
  return name + " by " + author
}
modules.export = getBlogTitle
```

### Com `import`:

É uma declaração (*statement*) para carregar módulos, disponível desde o *ES6*. <u>Sua
execução é **assíncrona**</u>.

Partindo do mesmo exemplo:

```javascript
// on local file: blogDetails.js
const getBlogTitle = (name, author) => {
  return name + " by " + author
}

export default getBlogTitle
// end of file

// on file that imports the module: index.js
import getBlogTitle from "./blogDetails.js"

var title = getBlogTitle ('Require vs Import in JavaScript', 'Chameera Dulanga')
console.log(title)
```

**OBS**: Para que o `import` funcione com *nodejs*, é necessário ter o arquivo `package.json` com
`"type": "module"`. Esta opção diz ao *nodejs* para interpretar os arquivos `.js` com a sintaxe do
*ES*, caso contrario obterá o erro `SyntaxError: Cannot use import statement outside a module`.
Veja mais em <https://nodejs.org/api/packages.html>.

### Pontos importantes
1. `require` pode ser chamado em qualquer parte do código e `import` deve ser descrito no início
do arquivo.
2. `require` poder ser chamado condicionalmente:
```javascript
if(articleCount>0){
  const getBlogTitle = require('./blogDetails.js')
}
```
3. `import` é assíncrono! Isso deve ser repetido porque em grandes aplicação, carregar módulos
um-por-um, ou seja, sincronamente como é o caso de `require`, compromete a performance da aplicação.



**Fontes**:
- <https://blog.bitsrc.io/javascript-require-vs-import-47827a361b77>
- <https://www.geeksforgeeks.org/difference-between-node-js-require-and-es6-import-and-export/>
- <https://stackoverflow.com/a/46677972>

# Gerenciador de pacotes NPM
Para utilizar bibliotecas e pacotes de terceiros precisamos do *npm* que já é instalado junto com o
*nodejs*, mesmo com nosso gerenciador de versão *npm*.

```bash
$ npm -v
7.0.15
```

## Necessário para uma aplicação em *Node.js*
O *npm* também gerencia as versões e dependências que um projeto *nodejs* precisa. Para inicia-lo,
basta executar o seguinte na pasta raiz de sua aplicação:

```bash
# Execute dentro da pasta raiz do seu projeto.
# Neste exemplo é na pasta './src/notes-app'.
$ cd ./src/notes-app
$ npm init
```
Com o comando acima gera um *prompt* com as opções a serem preenchidas que podem ser deixadas com
o valor apenas dando *ENTER* em todas. No caso gerou:

```text
$ npm init
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help init` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (notes-app)
version: (1.0.0)
description:
entry point: (app.js)
test command:
git repository:
keywords:
author:
license: (ISC)
```

Após finalizar o prompt `npm init`, ele criará o arquivo `package.json` com os valores de cada
opção. No meu caso, com a aplicação [notes-app](./src/notes-app), como já possuía este arquivo com
com a opção `"type": "module"` o *npm* a manteve, resultando no seguinte json:

```json
{
  "type": "module",
  "name": "notes-app",
  "version": "1.0.0",
  "description": "",
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}

```

## Adicionando um pacote

Para instalar/adicionar um pacote à ser utilizado na aplicação, basta executar na pasta raiz (mesma
que foi executado `npm init`) o comando `npm install <package>@<version>`.

Por exemplo, para instalar no projeto [notes-app](./src/notes-app) o pacote
[chalk](https://www.npmjs.com/package/chalk), que imprime no terminal com cores e estilos como
**negrito**, *itálico* etc, utilizei o seguinte:

```bash
$ npm install chalk@4.1.2
```

Com isso o *npm* adicionou o pacote instalado ao `package.json`

```json
{
  "type": "module",
  "name": "notes-app",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "chalk": "^4.1.2"
  }
}
```

Além do arquivo `package.json`, o *npm* também cria o `package-lock.json` com as versões
utilizadas pela aplicação *nodejs*. Estes dois arquivos são necessário para *buildar* o projeto,
sendo o `package-lock.json` recomendado não ser editado deixando apenas para o *npm*.

A pasta `node_modules` também será criada na pasta raiz, mas como o *npm* pode recria-las com o
comando `npm install` usando o `package.json` e o `package-lock.json` como referencia, é uma boa
prática incluir qualquer referencia a pastas `node_modules` ao seu `.gitignore`.

## *Arrow Function*

*Arrow functions*, introduzido a partir do *ES6*, permite escrever funções mais concisas, podendo
até serem resumidas à uma linha.

```javascript
// regular function
let regularSquare = function(x){
  return (x*x)
}

// arrow function
let arrowSquare = (x) => {
  return (x*x)
}

// concise arrow function
let conciseSquare = (x) => x*x
```

Ambas *regular functions* e *arrow functions* funcionam de maneira parecida, mas com algumas
diferenças importantes.

### `this`

A *arrow function* não possui escopo interno para `this`, como a *regular function*. Utilizar
`this` dentro de uma *arrow function* irá referencia o escopo de onde a *arrow function* esta
inserida (e não internamente dela).

**Exemplo 1:**
```javascript
function Mensagem() {
  this.mensagem = 'Passou'

  // Arrow function
  this.loggar = () => {
    console.log(this.mensagem)
  }
}

const msg = new Mensagem()
msg.loggar() // imprime "Passou"
```

<https://www.geeksforgeeks.org/difference-between-regular-functions-and-arrow-functions/>
<https://medium.com/frontend-quest/arrow-functions-vs-functions-9048ec12b5c6>

## Controverso e confuso `this.`
