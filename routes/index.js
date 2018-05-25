var resjs = '../public/javascripts/' 
var express = require('express');
var router = express.Router();
var  resbody = require(`${resjs}/res.js`)
var getlist = require('../mapers/getlist.js')
var fs = require('fs')
var filetool = require('formidable')
/* GET home page. */
/**
 * 首页界面
 * **/
router.get('/', function(req, res, next) {
  res.render('index');
});

/**
 * *
 *列表界面
 */
router.get('/getlist1',function(req,res,next){
	res.render('getlist')
})
/**
 * *
 *列表界面
 */
router.get('/update',function(req,res,next){
	 var id = req.query.id;
	 var senddata = {};
	 getlist.getlist1.find({'_id':id},function(err,doc){
	 		if(!err){
	 			senddata = doc;
	 			console.log(senddata)
	 			res.render('update',{'senddata':senddata})
	 		}
	 })
	 
	
})
/*
 *保存用户接口 
 * 
 * */
router.post('/getlist',function(req,res,next){
		let requestdata = {}
		try{
			requestdata.userName = req.body.userName;
			requestdata.password = req.body.password;
			requestdata.sex = req.body.sex;
			requestdata.homeAdress = req.body.homeAdress;
			requestdata.QQ = req.body.QQ;
			requestdata.Emaile = req.body.Emaile;
			requestdata.filel = req.body.filel;
		}catch(err){
			  res.send(resbody.error());
		}
		if(requestdata.userName && requestdata.password && requestdata.sex&& requestdata.homeAdress && requestdata.QQ && requestdata.Emaile){
			getlist.getlist1.create(requestdata,function(err,doc){
				res.send(resbody.success());
			});
		}else{
			res.send(resbody.error('参数传递不准确'));
		}
})

/******
 * 图片上传，单图上传文件
 ***/
router.post('/fileupload',function(req,res,next){
			var domain = 'http://localhost:3000';
			var serverpath = '/images/'
			var form = new filetool.IncomingForm();
			form.encoding = 'utf-8';        //设置编辑
		  form.uploadDir = 'public' + serverpath;     //设置上传目录
		  form.keepExtensions = true;     //保留后缀
		  form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
		  
		 	form.parse(req,function(err,fields,files){
		 		 var exname = ''
		 		 switch (files.files.type){
					case 'image/pjpeg':
		        exname = 'jpg';
		        break;
		      case 'image/jpeg':
		        exname = 'jpg';
		        break;
		      case 'image/png':
		        exname = 'png';
		        break;
		      case 'image/x-png':
		        exname = 'png';
		        break;
		 		 };
		 		 var data1 = new Date();
		 		 var Newiamges =data1.getTime()+parseInt(Math.random()*10000000) + '.' +exname;
		 		 var inpathfile = form.uploadDir+Newiamges;
		 		 var showurl = '..'+serverpath+Newiamges;
		 		 fs.renameSync(files.files.path,inpathfile);
		 		 res.send(resbody.success(showurl));
		 		 
		 	})
	})
	//获取所有用户接口
	router.post('/getall',function(req,res,next){
		getlist.getlist1.find({},function(err,doc){
			console.log(doc)
			res.send(resbody.success(doc))
		})
	})
	//删除接口
	router.post('/delete',function(req,res,next){
		var id = req.body.id
		getlist.getlist1.remove({'_id':id},function(err){
			if(!err){
				res.send(resbody.success('删除成功'))
			}else{
				console.log(err);
			}
		})
	})
	
	//更新接口
	router.post('/update',function(req,res,next){
		var id = req.body.id;
		var options = req.body.updatedata;
		getlist.getlist1.update({'_id':id},options,function(err){
			if(!err){
				res.send(resbody.success('修改成功'));
			}else{
				console.log(err);
			}
		})
	})
module.exports = router;
