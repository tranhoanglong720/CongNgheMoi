const express = require('express');
const multer = require('multer');
const app = express();
const port = 8080;
const data = require('./store');
const upload = multer();

app.use(express.static('./templatales'));
app.set('view engine', 'ejs');
app.set('views', './templatales');

//config connect aws dymongodb
const AWS = require('aws-sdk');

AWS.config = config;

const docCLient = new AWS.DynamoDB.DocumentClient();

const tableName = 'KhachHang';

app.get('/', (req, res) => {
    //    //return res.render('index');

    //    return res.render('index',{data:data});
    const params = {
        TableName: tableName,
    };

    docCLient.scan(params, (err, data) => {
        if (err) {
            res.send('Internal Server Error');
        } else {
            console.log('data = ', JSON.stringify(data));
            return res.render('index', { data: data.Items })
        }
    });
});



app.post('/', upload.fields([]), (req, res) => {
    // console.log('req.body =' ,_req.body);
    // data.push(_req.body);
    // return res.redirect('/')
    // const { ma_sp, ten_sp, so_luong } = req.body;

    const { id, gioitinh } = req.body;

    const params = {
        TableName: tableName,
        Item: {
            // "ma_sp": ma_sp,
            // "ten_sp": ten_sp,
            // "so_luong": so_luong
            "id" : id,
            "gioitinh" : (gioitinh === 'true')
        }
    }

    docCLient.put(params, (err, data) => {
        if (err) {
            res.send('Internal Server Error');
        } else {
            return res.redirect("/");
        }
    });
});

app.post('/delete', upload.fields([]), (req, res) => {
    const listItems = Object.keys(req.body);

    if(listItems.length === 0) {
        return res.redirect("/");
    }

    function onDeleteItem(index) {
        const params = {
            TableName: tableName,
            Key: {
                // "ma_sp": listItems[index]
                "id": listItems[index]
            }
        }

        docCLient.delete(params, (err, data) => {
            if(err) {
                console.log("Internal Server Error");
            } else {
                if (index > 0) {
                    onDeleteItem(index - 1);

                } else {
                    return res.redirect("/");
                }
            }
        })
    }
    onDeleteItem(listItems.length - 1)
});



app.listen(port, function() {
    console.log("Your app running on port " + port);
})