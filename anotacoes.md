# Instalação
Utilizar controle de versão com `nvm`, veja mais em: <https://github.com/nvm-sh/nvm>

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
const fs = require('fs')
fs.writeFileSync('about_me.txt', 'I live in São Paulo')
```

## Diferença entre *require* e *import*

Assim como *commonJS*, a inclusão de módulos é feita com `require` do *nodejs* e com `import` do
*ES6* (*ECMAScript 6* ou mais atual), seja de arquivos separados ou de módulos nativos.

`require`: Função nativa (*built-in*) do *nodejs*, ou seja, não é disponível no *ES6* isolado como
no console do navegador. Pode ser utilizada para módulos nativos e para locais. Ela basicamente lê
um arquivo JavaScript, executa o arquivo e então retorna o objeto de exportação. Sua execução é
estritamente **síncrona**.

Exemplo:
```javascript
// built-in moduels
const http= require('http');
// local moduels
const getBlogName = require('./blogDetails.js')
```

**OBS**: Para módulos locais é necessário exportá-los usando `modules.export` no arquivo de origem.

```javascript
// on local file blogDetails.js
const getBlogTitle = (name, author) => {
  return name + " by " + author;
}
modules.export = getBlogTitle;
```

`import`: É uma declaração (*statement*) para carregar módulos, disponível desde o *ES6*. Sua
execução é **assíncrona**.

Partindo do mesmo exemplo:

```javascript
// on local file: blogDetails.js
const getBlogTitle = (name, author) => {
  return name + " by " + author;
}

export default getBlogTitle;
// end of file

// on file that imports the module: index.js
import getBlogTitle from "./blogDetails.js";

var title = getBlogTitle ('Require vs Import in JavaScript', 'Chameera Dulanga');
```

### Pontos importantes

1 - `require` pode ser chamado em qualquer parte do código e `import` deve ser descrito no início
do arquivo.
2 - `require` poder ser chamado condicionalmente:
```javascript
if(articleCount>0){
  const getBlogTitle = require('./blogDetails.js');
}
```
3 - `import` é assíncrono! Isso deve ser repetido porque em grandes aplicação, carregar módulos
um-por-um, ou seja, sincronamente como é o caso de `require`, compromete a performance da aplicação.



**Fontes**:
- <https://blog.bitsrc.io/javascript-require-vs-import-47827a361b77>
- <https://www.geeksforgeeks.org/difference-between-node-js-require-and-es6-import-and-export/>
- <https://stackoverflow.com/a/46677972>
