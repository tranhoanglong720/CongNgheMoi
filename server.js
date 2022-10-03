const express=require('express');
const app=express();
const port=3000;
//Multer
const multer=require('multer');
const data=require('./store');
const upload=multer();

//config AWS
var AWS=require('aws-sdk');
const config=new AWS.Config({
    accessKeyId:'AKIAR3N53XHKZMCG3B76',
    secretAccessKey:'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',
    region:'ap-southeast-1'
});
AWS.config=config;
const docClient=new AWS.DynamoDB.DocumentClient();
const tableName='TestGK';
//
app.use(express.static('./views'));
app.set('view engine','ejs');
app.set('views','./views');

app.get('/',function(req,res){
    const params={
        TableName:tableName,
    };
    docClient.scan(params,(err,data)=>{
        if(err){
             res.send('Loi Ket Noi');
        }
        else{
            return res.render('index',{data:data.Items});
        }
    })

});


app.post('/Them',upload.fields([]),function(req,res){
    const {TenSp,MaSp,SoLuong} =req.body;
    const params={
        TableName:tableName,
        Item:{
            "TenSp":TenSp,
            "MaSp":MaSp,
            "SoLuong":SoLuong
        }
    };
    docClient.put(params,(err,data)=>{
        if(err){
           // console.log(err);
            res.send('Loi Ket Noi');
        }
        else{
            return res.redirect("/");
        }
    });

});

app.post('/delete',upload.fields([]),(req,res)=>{
    const listitems=Object.keys(req.body);
    if(listitems.length ===0){
        return res.redirect("/");
    }
    function ondeleteItem(index){
        const params={
            TableName:tableName,
            Key:{
                "TenSp":listitems[index]
            }
        }
        docClient.delete(params,(err,data)=>{
            if(err){
                return res.send('Loi Ket noi');
            }
            else
            if(index>0){
                    ondeleteItem(index-1);
            }
            else{
                return res.redirect("/");
            }
        })
    }
    ondeleteItem(listitems.length-1);
});


app.get('/Them',function(req,res){
    return res.render('Them');
});


app.listen(port,function(){
    console.log('Ket Noi Voi:'+port);
});