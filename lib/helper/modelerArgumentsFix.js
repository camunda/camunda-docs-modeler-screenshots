const fs = require('fs');

let content = fs.readFileSync('./camunda-modeler/app/prod.js').toString();

content = 'process.argv = process.argv.filter(arg => !arg.includes(\'prod.js\'));' + content;

fs.writeFileSync('./camunda-modeler/app/prod.js', content);