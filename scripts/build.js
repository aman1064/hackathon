const bundle = require('./bundle');
const preRender = require('./prerender');


let build = bundle();

if(process.argv.includes("--static")) {
    build = build.then(preRender);
}