# Notes App

Aplicação-exercício proposto no primeiro modulo do curso
[The Complete Node.js Developer Course (3rd Edition)](https://www.udemy.com/course/the-complete-nodejs-developer-course-2/)
aplicado por [Andrew Mead](https://github.com/andrewjmead). Consiste em um programa de execução no
terminal, ou do inglês *command-line application*, do qual o usuário pode adicionar, remover,
listar e ler "notas" que possuem título e corpo e são salvas localmente em um arquivo json.
Trata-se de um problema simples para se trabalhar com conceitos de entrada e saída
(*Input*/*Output*) e instalação/uso de pacotes externos, no caso
[yargs](https://www.npmjs.com/package/yargs) e [chalk](https://www.npmjs.com/package/chalk).

## Pontos adiconais
Refatorei a solução para substituir o uso de `require` para importações de módulos instalados e/ou
locais pelo recomendo `import`, seguindo o padrão do ES6, mas isso infelizmente não foi trivial.
Depois de alguns minutos de Google descobri o problema, **muito bem detalhado aqui**:
<https://github.com/yargs/yargs/issues/1854#issuecomment-787509517> por
[Benjamin E. Coe](https://github.com/bcoe).

Ele explica que no ES6 o pacote *yargs* utilizado não é
mais um *singleton* - grosseiramente falando, um objeto de instância única do qual você pode chamar
métodos diretamente como é feito no curso - agora é preciso chama-lo à uma variável, instância-lo
com `yargs()`, para então poder utilizar os métodos definidos.

No curso *yargs* é tratado assim:
```javascript
const yargs = require('yargs')
const notes = require('./notes.js')

// Customize yargs version
yargs.version('1.1.0')

// Create add command
yargs.command({
    command: 'add',
    describe: 'Add a new note',
    builder: {
        title: {
            describe: 'Note title',
            demandOption: true,
            type: 'string'
        },
        body: {
            describe: 'Note body',
            demandOption: true,
            type: 'string'
        }
    },
    handler(argv) {
        notes.addNote(argv.title, argv.body)
    }
})

// other commands
```

No ES6 precisa ser assim:
```javascript
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import notes from './notes.js'

// Yargs stored version number
const yarg = yargs(hideBin(process.argv)) // hideBin is a shorthand for process.argv.slice(2)
yarg.version('1.0.0')

// Create add command
yarg.command({
    command: 'add',
    describe: 'Add a new note',
    builder: {
        title: {
            describe: 'Note title',
            demandOption: true,
            type: 'string'
        },
        body: {
            describe: 'Note body',
            demandOption: true,
            type: 'string'
        }
    },
    handler(argv) {
        notes.addNote(argv.title, argv.body)
    }
})

// other commands
```


