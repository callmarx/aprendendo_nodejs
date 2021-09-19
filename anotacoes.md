# Um pouco sobre JavaScript/ECMAScript

A base de tudo aqui é o JavaScript e para isso foi importante repassar alguns conceitos e
funcionalidades da linguagem.

## Mas é JavaScript ou ECMAScript?

Parece confuso mas é uma questão de historia. O JavaScript surgiu em 1995 com proposito de ser um
script simples para navegadores, propiciando interações dinâmicas nos sites dos quais o HTML e CSS
não permitem. Dois anos depois, em 1997, a organização
[Internacional ECMA](https://en.wikipedia.org/wiki/Ecma_International), organização sem fins
lucrativos, lança o primeiro ECMAScript no intuito de padronizar as especificações do JavaScript.

O próprio nome JavaScript não foi (e continua não sendo) um consenso: primeiro chamava-se Mocha,
depois foi renomeado para LiveScript e só depois de ser submetido para padronização à
organização Internacional ECMA que então foi definida oficialmente como ECMAScript. Isso mesmo,
**o certo é ECMAScript!** O nome JavaScript nem é aberto! Ele é uma marca comercial da Sun
(adquirida pela Oracle em 2009). Pode-se dizer que JavaScript é um "dialeto", um "apelido", para
ECMAScript.

## *Regular Function* e *Arrow Function*

*Arrow functions*, introduzido a partir do *ES6* (*ECMAScript 6* ou mais atual), permite escrever
funções mais concisas, podendo até serem resumidas à uma linha.

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

### Não se perca com o `this`

A *arrow function* não possui escopo interno para `this`, como a *regular function*, e isso pode
ser bem confuso. Montei os seguintes exemplos para ilustrar melhor.

```javascript
function TryThis() {
  this.value = "main scope"

  // regular function
  this.test = function() {
      setTimeout(function() {
        console.log(this.value);
      },0)
  };
}

var tt = new TryThis()
tt.test()
```
Ao executar a última linha com `tt.test()`, obtemos `undefined`, pois dentro da função passada como
argumento para *setTimeout* não temos acesso à `this.value`. Para esclarecer melhor este exemplo,
vamos refatorá-lo com algumas chamadas a mais de `console.log()` e comentários para descrever os
escopos percorridos:

```javascript
function TryThis() { // <----------------- Inside main scope ------------------------|
  this.value = "main scope"//                                                        |
                           //                                                        |
  this.test = function() { // Still inside on main scope                             |
      console.log(`Inside .test function: ${this.value}`) //                         |
      setTimeout(         //                                                         |
        function() { //   <---------- Inside setTimeout arg function scope -------|  x
                     //     Can't see this.value because I'm in another scope     |  x
          console.log(`Inside setTimeout arg function: ${this.value}`)  //        |  x
        },           //   <-------------------------------------------------------|  x
      0)             // I'm back to main scope                                       |
  } //                                                                               |
}   //            <------------------------------------------------------------------|

var tt = new TryThis()
tt.test()
```
Desta forma, `tt.test()` retorna:
```
Inside .test function: main scope
Inside setTimeout arg function: undefined
```

A primeira menção de `function()` não nos remove do primeiro escopo (que eu chamei de *main scope*
nos comentários), pois trata-se de uma definição de método para `this.test()` e por isso obtemos
`Inside .test function: main scope` no primeiro `console.log()`. Agora, já a segunda menção de
`function()` utilizamos para o primeiro parâmetro de *setTimeout* como um função anônima o que gera
seu próprio escopo e portanto perde acesso ao `this.value` definido antes.

O **pulo do gato** é que utilizar `this` dentro de uma *arrow function* irá referenciar o escopo de
onde a *arrow function* esta inserida e não internamente dela, já que **as *arrow functions* não
criam escopo próprio para o lexical `this`**. Solucionando nosso exemplo, temos:

```javascript
function TryThis() {
  this.value = "main scope"

  // arrow function
  this.test = function() {
      setTimeout(()=> {
        console.log(this.value);
      },0)
  };
}

var tt = new TryThis()
tt.test() // prints "main scope"
```

### *arrow function* é sempre anônima

A *regular function* pode ser tanto ser declarada anonimamente, podendo ser ou não atribuída à uma
variável, como não-anônima com um nome próprio. Já as *arrows functions* **são sempre anonimas**,
mas também podem ser atribuídas à uma variável.

```javascript
function ImNotAnonymous(){
  console.log("Hi, I'm a regular and not anonymous function")
}

const anonymousVar = function() {
  console.log("Hi, I'm a regular anonymous function on a variable")
}

const anonymousArrow = (x)=>{
  console.log(`Hi, I'm a arrow function on a variable with argument: ${x}`)
}
```

### Acesso à argumentos

Uma *regular function*, independente de como é empregada, sempre terá acesso aos seus argumentos
com `arguments`:

```javascript
let someObject = {
    some_method(){
        console.log(arguments)
    }
}
someObject.some_method(1, 2, 3)
// prints "[Arguments] { '0': 1, '1': 2, '2': 3 }"

function someRegular(){
  console.log(arguments)
}
someRegular(1, 2, 3)
// prints "[Arguments] { '0': 1, '1': 2, '2': 3 }"

const otherRegular = function(){
  console.log(arguments)
}
otherRegular(1, 2, 3)
// prints "[Arguments] { '0': 1, '1': 2, '2': 3 }"
```

Já a *arrow function* **não tem acesso aos seus argumentos**.

```javascript
let someObject = {
    some_method: () => {
        console.log(arguments)
    }
}
someObject.some_method(1, 2, 3)
// throws this error "Uncaught ReferenceError: arguments is not defined"

const someArrow = () => {
  console.log(arguments)
}
someArrow(1, 2, 3)
// throws this error "Uncaught ReferenceError: arguments is not defined"
```

### Atenção para a Sintaxe de Espelhamento

É possível ter acesso à múltiplos argumentos (sem restringir uma quantidade) com a
*arrow function* através da sintaxe de espalhamento (*spread syntax*) através do uso de `...` + o
nome da variável (*spread operator*). Veja uma exemplo a seguir:

```javascript
const sum = (...args) => {
  // args is an array with all arguments passed
  return args.reduce((a, b) => a + b, 0)
}
sum(1,2)     // will return 3
sum(1,2,3)   // will return 6
sum(1,2,3,4) // will return 10
```

Um *spread operator*, no caso acima `...ags`, retorna um *array* descompactado. Ou sejam, ele
"espalha" (*spread*) o *array*. No entanto, trata-se de um **operador de propagação** que funciona apenas como
em um argumento para uma função ou em um literal de array. Por exemplo, o código a seguir não
funciona:

```javascript
const arr = [0, 1, 2]
const spreaded = ...arr
// will throw this error: "Uncaught SyntaxError: Unexpected token '...'"
```

Para o código acima funcionar, precisa ser o seguinte:

```javascript
const arr = [0, 1, 2]
const spreaded = [...arr] // spreaded will be an array with same values of arr

// we also can do
spreaded = [...arr, 3] // spreaded will be [0, 1, 2, 3]
```

### Construtores e inicialização (vulgo `new`)

As *arrow functions* não têm o recurso *prototype*, o qual podemos "simular" orientação à objetos
em JavaScript, sendo assim elas **não possuem construtor** e portanto **não podem ser
"inicializadas"**.

**OBS**: A partir do *ES5* os JavaScript ganhou a sintaxe `class`, com um uso muito parecido com o
do C++ e Java o que "escondeu" a prototipagem para o desenvolvedor na orientação à objetos.

```javascript
let someRegular = function() {
  console.log(arguments)
}
let sr = new someRegular(1,2,3)
// prints "[Arguments] { '0': 1, '1': 2, '2': 3 }"

let someArrow = () => {
  console.log(arguments)
}
let sr = new someArrow(1,2,3)
// throws this error "Uncaught TypeError: otherArrow is not a constructor"
```

No exemplo acima, vemos que ao instanciar `someRegular()` à variável `sr` na linha
`let sr = new someRegular(1,2,3)`, o primeiro `console.log()` é executado como um se fosse o
construtor de `someRegular()`. Já na segunda parte não conseguimos inicializar `someArrow()` e
obtemos o erro `Uncaught TypeError: otherArrow is not a constructor`. Note ainda que o segundo
`console.log` tentar acessar os argumentos de `someArrow()` o que não é possível com vimos no item
anterior, mesmo assim a execução nem chega nessa parte já que não é possível inicializar
`someArrow()`.

Além do mais, como vimos no item sobre `this`, a *arrow function* não possui escopo para o lexical
`this` próprio (acessa o de onde foi inserida), logo também não faria sentido poder ser
inicializada.

## Estrutura de dados
PENDING!!!

## Programação Funcional
PENDING!!!

## Objetos e Orientação à objetos (POO)
PENDING!!!

### Associação desestruturada

Do inglês *destructuring assignment*, trata-se de uma sintaxe especial que nos permite
"descompactar" um *array* ou objeto à um conjunto de variáveis.

#### Em *arrays*

```javascript
// Example 1:
let names = ["Eugenio", "Nila"]
let [firstName, surname] = names

console.log(firstName) // prints "Eugenio"
console.log(surname)   // prints "Nila"

// Example 2:
const [a, b,,, c] = [1, 2, 3, 4, 5, 6];
// variable a will have 1
// variable b will have 2
// variable c will have 5

console.log(a, b, c) // prints "1 2 5"
```

#### Em objetos

Em objetos é importante pontuar que essa associação funcionará ou se os nomes das variáveis forem
os mesmos dos atributos de um objeto (como no exemplo 3 a seguir) **ou** se esses atributos forem
especificados (exemplo 4).

```javascript
// Example 3:
const HIGH_TEMPERATURES = {
  yesterday: 75,
  today: 77,
  tomorrow: 80
}

const { today, tomorrow } = HIGH_TEMPERATURES
// variable today will have 77
// variable tomorrow will have 80

// Example 4:
const HIGH_TEMPERATURES = {
  yesterday: 75,
  today: 77,
  tomorrow: 80
};

const { today: highToday, tomorrow: highTomorrow}  = HIGH_TEMPERATURES
// variable highToday will have 77
// variable highTomorrow will have 80
```
Note ainda, que no exemplo 2 que o atributo vai como "chave" e a variável como "valor" para essa
associação desestruturada. A mesma lógica deve ser aplicada para atributos aninhados (*nested*).

```javascript
// Example 5: with nested attributes
const LOCAL_FORECAST = {
  yesterday: { low: 61, high: 75 },
  today: { low: 64, high: 77 },
  tomorrow: { low: 68, high: 80 }
};

const { today: { low: lowToday, high: highToday }} = LOCAL_FORECAST
// variable lowToday will have 64
// variable highToday will have 77
```

#### Combinando com *spread operator*

Podemos combinar essa associação desestruturada com a sintaxe de espalhamento, o *spread operator*.
Digamos que preciso implementar a função `removeFirstTwo()` que dada um *array* de argumento
devemos retornar ou outro *array* sem seus dois primeiros elementos. Veja como fica:

```javascript
const source = [1,2,3,4,5,6,7,8,9,10]
function removeFirstTwo(list) {
  const [,,...arr] = list // we ignore the two first elements
  return arr
}
const arr = removeFirstTwo(source)
```

#### Pode ser utilizada como parâmetro

Podemos fazer essa desestruturação diretamente nos parâmetros de uma função ao invés de trabalhar
internamente com um objeto ou *array* passado como parâmetro.

```javascript
const stats = {
  max: 56.78,
  standard_deviation: 4.34,
  median: 34.54,
  mode: 23.87,
  min: -0.75,
  average: 35.85
};

// Example with a whole object as argument
function getHalf(obj) {
  return (obj.max + obj.min) / 2.0
}
getHalf(stats) // will return 28.015

// Example with destructured argument
const betterGetHalf = ({ max, min }) => (max + min) / 2.0;
betterGetHalf(stats) // will return 28.015
```

## Promessa - não minha, do ECMAScript, juro!

O objeto `Promise`, meio pré-definido, que representa um eventual sucesso ou falha de uma operação
assíncrona.

PENDING!!!

# Node.js

Node.js é um "ambiente executador" - *runtime environment* - de JavaScript para a parte do lado
servidor de aplicação (popular *server side* ou *back-end*), ou seja, serve para ser executado
fora do navegador, instalado em uma maquina com Linux, MacOS ou Microsoft Windows.

## Instalação
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

## Documentação
Usar e abusar de <https://nodejs.org/api/>

**OBS**: Por exemplo, quando usamos *console*, como `console.log`, trata-se de um
[modulo do nodejs](https://nodejs.org/api/console.html), também disponível no console dos
navegadores.

## Módulos nativos (*core modules*)
Na documentação do *nodejs* podemos ver diversos módulos nativos disponíveis para serem importados
e utilizados, como por exemplo o *File System* em `lib/fs.js`.

```javascript
import * as fs from 'fs'
fs.writeFileSync('about_me.txt', 'I live in São Paulo')
```

### Diferença entre *require* e *import*
A inclusão de módulos é feita com `require` do *nodejs* ou com `import` do *ES6*, seja de arquivos
separados ou de módulos nativos.

#### Com `require`:
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

#### Com `import`:

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

#### Pontos importantes
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


### Posso até exportar uma função anonima!

Embora isso seja uma característica do ECMAScript, achei importe pontuar aqui na parte de Node.js
já que falamos anteriormente sobre as diferenças de `require` e `import`. Fiquei confuso quando vi
isso a primeira vez. Suponha que temos o arquivo `iam_not_fool.js` com o seguinte:

```javascript
// iam_not_fool.js
export default () => console.log('Hello world!');
```

Parece meme né?! Porque exportar uma função anonima?
Ora, porque eu posso associar essa função à algum nome em sua importação.

```javascript
// On other file, like index.js, in same folder
import helloWord from './iam_not_fool.js'

helloWorld() // will print "Hello world" :)
```

## Gerenciador de pacotes NPM
Para utilizar bibliotecas e pacotes de terceiros precisamos do *npm* que já é instalado junto com o
*nodejs*, mesmo com nosso gerenciador de versão *npm*.

```bash
$ npm -v
7.0.15
```

### Necessário para uma aplicação em *Node.js*
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

### Adicionando um pacote

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



# Artigos, postagens, cursos, etc

Abaixo segue os links de artigos, postagens e cursos pelos quais eu passei.

- <https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures>
- <https://stackoverflow.com/a/2475528>
- <https://en.wikipedia.org/wiki/JavaScript>
- <https://en.wikipedia.org/wiki/ECMAScript>
- <https://en.wikipedia.org/wiki/Ecma_International>
- <https://en.wikipedia.org/wiki/Node.js>
- <https://nodejs.org/api/>
- <https://github.com/nvm-sh/nvm>
- <https://www.geeksforgeeks.org/difference-between-regular-functions-and-arrow-functions/>
- <https://medium.com/frontend-quest/arrow-functions-vs-functions-9048ec12b5c6>
- <https://blog.bitsrc.io/javascript-require-vs-import-47827a361b77>
- <https://www.geeksforgeeks.org/difference-between-node-js-require-and-es6-import-and-export/>
- <https://stackoverflow.com/a/46677972>
