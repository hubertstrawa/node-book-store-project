const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const bookData = JSON.parse(json);

const server = http.createServer((req, res) => {
    const pathName = url.parse(req.url, true).pathname;
    console.log(pathName);
    const id = url.parse(req.url, true).query.id;

    // PRODUCTS OVERVIEW
    if (pathName === '/products' || pathName === '/') {
        res.writeHead(200, { 'Content-type': 'text/html'});

        fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => {
            let overviewOutput = data;

            fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => {
                const cardsOutput = bookData.map(el => replaceTemplate(data, el)).join('');
                overviewOutput = overviewOutput.replace('{%CARDS%}', cardsOutput);
                res.end(overviewOutput);
            });
        });

    }
    
    // BOOK DETAILS
    else if (pathName === '/book' && id < bookData.length) {
        res.writeHead(200, { 'Content-type': 'text/html'});

        fs.readFile(`${__dirname}/templates/template-book.html`, 'utf-8', (err, data) => {
            const book = bookData[id];
            const output = replaceTemplate(data, book);
            res.end(output);
        });
    }

    // IMAGES
    else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
        fs.readFile(`${__dirname}/data/img/${pathName}`, (err, data) => {
            res.writeHead(200, { 'Content-type': 'image/jpg'});
            res.end(data);
        })
    }

    // URL IS NOT FOUND
    else {
        res.writeHead(404, { 'Content-type': 'text/html'});
        res.end('URL was not found');
    }
});

server.listen(1337, '127.0.0.1', () => {
    console.log('Listening for requests now');
});

function replaceTemplate(originalHtml, book) {
    let output = originalHtml.replace(/{%PRODUCTNAME%}/g, book.productName);
    output = output.replace(/{%IMAGE%}/g, book.image);
    output = output.replace(/{%PRICE%}/g, book.price);
    output = output.replace(/{%AUTHOR%}/g, book.author);
    output = output.replace(/{%RATING%}/g, book.rating);
    output = output.replace(/{%YEAR%}/g, book.year);
    output = output.replace(/{%SHIPPING%}/g, book.shipping);
    output = output.replace(/{%DESCRIPTION%}/g, book.description);
    output = output.replace(/{%ID%}/g, book.id);
    return output;
}