const { sh, cli } = require('tasksfile')

function hello(options, name = 'Mysterious') {
  console.log(`Hello ${name}!`)
}

function makedir() {
  sh('mkdir somedir')
}

cli({
  hello,
  makedir
})
