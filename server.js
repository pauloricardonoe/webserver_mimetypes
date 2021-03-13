const http = require('http');
const url  = require('url');  // parse URL
const fs   = require('fs');   // Sistema de Arquivos
const path = require('path'); // lidar com caminhos de arquivos, extensões

const hostname = '127.0.0.1';
const port     = 3000;

// Média Types
// Padrão que indica a natureza e o formato de um arquivo
const mimeTypes = {
  html: "text/html",
  css:  "text/css",
  js:   "application/javascript",
  png:  "image/png",
  jpeg: "image/jpeg",
  jpg:  "image/jpg",
  woff: "font/woof"
}

http.createServer((req, res) => {
  //let acesso_uri = url.parse(req.url).pathname;
  let acesso_uri = req.url;
  let caminho_completo_recurso = path.join(process.cwd(), decodeURI(acesso_uri));
  console.log(caminho_completo_recurso);

  let recurso_carregado;
  try {
    recurso_carregado = fs.lstatSync(caminho_completo_recurso);
  } catch (error) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('404: Arquivo não encontrado!');
    res.end();
    return;
  }

  if (recurso_carregado.isFile()) {
    let extensao = path.extname(caminho_completo_recurso).substring(1);
    let mimeType = mimeTypes[extensao] || "text/plain";
    res.writeHead(200, {'Content-Type': mimeType});

    let stream_arquivo = fs.createReadStream(caminho_completo_recurso);
    stream_arquivo.pipe(res);

  } else if (recurso_carregado.isDirectory()) {

    res.writeHead(302, {'Location': 'index.html'});
    res.end();

  } else {
    res.writeHead(500, {'Content-Type': 'text/plain'})
    res.write('500: Erro interno do servidor!');
    res.end();
  }

}).listen(port, hostname, () => {
  console.log(`Servidor atendendo em http://${hostname}:${port}/`);
});
