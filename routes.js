var fs = require('fs'),
    path = require('path'),
    file_read = require('./list_files'),
    formidable = require('formidable');

module.exports = function(app) {
    app.get('/', function(req, res, next) {
        res.render('index');
    });

    app.get('/upload', function(req, res, next) {
        res.render('upload');
    });

    app.post('/file-upload', function(req, res, next) {
        //console.log(req.body);
        //get the temp path
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            // define err page
            if (err) return res.end('upload file error');
            var tmp_path = files.thumbnail.path;
            //specific the upload to path
            var target_path = './public/upload/' + files.thumbnail.name;
            var source = fs.createReadStream(tmp_path);
            var dest = fs.createWriteStream(target_path);
            source.pipe(dest);
            res.end('thanks for upload ');
        })
    });

    app.get('/image', function(req, res) {
        fs.readFile('./logo.png', function(err, data) {
            if (err) throw err;
            //res.writeHead(200, {'Content-Type' : 'image/png' });
            //res.write(data, 'binary');
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write('<html><body>Image Server<br><img src="data:image/jpeg;base64,');
            res.write(new Buffer(data).toString('base64'));
            res.write('"/>');
            res.write('<br><p>New line</p></body></html>');
        });
    });

    app.get('/download_page', function(req, res, next) {
        res.render('download');
    });

    app.get('/get_files', file_read.get_lists);

    app.get('/download/*', function(req, res, next) {
        target_file = path.join(__dirname, 'public', 'upload', req.params[0]);
        var f = target_file;
        f = path.resolve(f);
        res.download(f);
    });

};
