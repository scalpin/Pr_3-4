const http = require('http');
const fs = require('fs');
const path = require('path');

const getContentType = (ext) => {
    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
    };
    return mimeTypes[ext] || 'application/octet-stream';
};

http.createServer((req, res) => {
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    let ext = path.extname(filePath);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            fs.readFile(path.join(__dirname, '404.html'), 'utf8', (err404, data404) => {
                if (!err404) {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(data404);
                } else {
                    res.writeHead(500, { 'Content-Type': 'text/html' });
                    res.end('<h1>500: Внутренняя ошибка сервера</h1>');
                }
            });
        } else {
            res.writeHead(200, { 'Content-Type': getContentType(ext) });
            res.end(data);
        }
    });
}).listen(8080, () => {
    console.log('Сервер запущен на порту 8080');
});

