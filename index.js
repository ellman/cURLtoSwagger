const fs = require('fs');
const express = require('express')
const app = express();
const deepMerge = require('deepmerge');
const bodyParser = require('body-parser');

app.use(bodyParser.json())

const PATH_TO_SWAGGER = '/home/yonatan/Repos/api-wrapper/docs/swagger.json';

app.post('/update', function (req, res, next) {

    let json = req.body;
    let doc = JSON.parse(fs.readFileSync(PATH_TO_SWAGGER).toString());

    let keys = Object.keys(json);
    let method =  Object.keys(json[keys[0]])[0]
    if (!doc[keys[0]]) {
        doc.paths[keys[0]] = json[keys[0]]
    } else {
        doc.paths[keys[0]] = deepMerge([doc.paths[keys[0]], json[keys[0]]])
    }

    // this is hard coded for our specific case but needs to be configurable
    doc.paths[keys[0]][method].tags = doc.paths[keys[0]][method].tags || [keys[0].split('/')[2]];


    fs.writeFileSync(PATH_TO_SWAGGER, new Buffer(JSON.stringify(doc, null, 2)));

    return res.status(200).json({ success: true });
})

app.use(express.static('./public'));

app.listen(4000)