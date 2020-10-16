// include modules
var    express = require('express')
path = require('path')
less = require('less-middleware');
const fs = require('fs')

const bodyParser = require("body-parser");
const app = express();
    
// compile and serve css
app.use(less(path.join(__dirname,'source','less'),{
    dest: path.join(__dirname, 'public'),
    options: {
        compiler: {
            compress: false,
        },
    },
    preprocess: {
        path: function(pathname, req) {
            return pathname.replace('/css/','/'); 
        },
    },
    force: true,
}));
// serve static content
app.use(express.static(path.join(__dirname, 'public')));

// setup server
var server = app.listen(1337);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post('/update-party', update_party);
app.get('/party-viewer/:streamer', view_party);
app.get('/party-changes/:streamer', get_party);

async function view_party(req, res) {
    res.statusCode = 200;
    var root_path = path.join(__dirname, 'public')
    var options = {
        root: root_path
    }
    
    var htmlFile = root_path + '/' + req.params.streamer + '.html'
    if(!fs.existsSync( htmlFile )) {
        fs.copyFileSync(root_path + '/' + 'party-template.html', htmlFile)
    }

    res.sendFile(req.params.streamer + '.html', options)
}

var parties = { }

async function update_party(req, res) {
    try
    {
        let data = req.body
        parties[req.headers.streamer.toLowerCase()] = data
        console.log(parties)
    } catch (ex) {
        console.error(ex);
        hadError = true;
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
}

async function get_party(req, res) {
    console.log(parties[req.params.streamer])
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(JSON.stringify(parties[req.params.streamer]));
}
