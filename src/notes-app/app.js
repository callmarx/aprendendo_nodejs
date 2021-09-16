import chalk from 'chalk'
import getNotes from './notes.js'

console.log(getNotes())
console.log(chalk.green.bold.inverse('Success!'))
