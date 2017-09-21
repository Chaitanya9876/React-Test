### React+ Node image upload

#### front-end : webpack dev server

 - launch index.html
 - npm install 
 - npm run build
 - npm run start 
 
#### back-end : node server running on port : 3000

- npm install 
- node app.js

### mutler : file upload 
```javascript
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './Uploads');
    },

    filename: function (req, file, callback) {
        var uniqName = Date.now() + '-' + file.originalname,
            filesKeys = Object.keys(files);

        callback(null, uniqName);

        files[filesKeys
                ? filesKeys.length
                : 0] = uniqName;

        fs.writeFile('files.json', JSON.stringify(files), function (err) {
            if (err)
                return res.end('Something went wrong during writing files.json');
            }
        );
    }
});

var upload = multer({
    storage: storage
}, {
    limits: {
        fieldNameSize: 1000,
        fieldSize: 1000
    }
}).single('userFile');

var transformData = function (files) {
    var data = [];

    for (var key in files) {
        data.push({
            name: files[key],
            url: '../back-end/Uploads/' + files[key]
        })
    }

    return data;
};
``` 


