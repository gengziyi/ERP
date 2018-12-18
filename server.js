const express = require("express");
const server = express();
const static = require("express-static");
const url = require("url");
const ejs = require("ejs");
const mysql = require("mysql");
const port = 88;

const sql = mysql.createConnection({
	host:"localhost",
	user:"root",
	password:"123456",
	database:"erp",
	timezone:"08:00"
})

//首页
server.get("/",(request,response)=>{
	ejs.renderFile("static/index.html",{},(error,data)=>{
		if (error) {
			console.log(error);
			response.end(data);
		}
		else{
			response.end(data);
		}
	})
})

//获取员工信息接口
server.get("/getworkers",(request,response)=>{
	sql.query(`select * from workersList`,(error,data)=>{
		if (error) {
			console.log(error);
			response.send("查询失败")
		}
		else {
			//重载性别数据
			for(let item of data){
				item.sex = item.sex ? "男" : "女"
			}
			//重载在职状态
			for(let item of data){
				item.entry = item.entry ? "在职" : "离职"
			}
			response.send(data);
		}
	})
})

//删除员工
server.get("/deleteworker",(request,response)=>{
	var workerId = url.parse(request.url,true).query.id;
	sql.query(`delete from workersList where id=${workerId}`,(error,data)=>{
		if (error) {
			response.end("error");
		}
		else{
			response.end("success");
		}
	})
})

//添加员工信息接口
server.get("/addworker",(request,response)=>{
	var params = url.parse(request.url,true).query;
	//重载性别 在职状态
	if(params.sex == "男"){
		params.sex = "1";
	}
	else{
		params.sex = "0";
	}
	if(params.entry == "在职"){
		params.entry = "1";
	}
	else{
		params.entry = "0";
	}
	if(params.leaveDate){
		var sqlInto = `insert into workersList (name,daseSalary,department,title,joinDate,sex,birthday,entry,leaveDate) values ("${params.name}","${params.daseSalary}","${params.department}","${params.title}","${params.joinDate}","${params.sex}","${params.birthday}","${params.entry}","${params.leaveDate}")`
	}
	else{
		var sqlInto = `insert into workersList (name,daseSalary,department,title,joinDate,sex,birthday,entry) values ("${params.name}","${params.daseSalary}","${params.department}","${params.title}","${params.joinDate}","${params.sex}","${params.birthday}","${params.entry}")`
	}
	sql.query(sqlInto,(error,data)=>{
		if (error) {
			console.log(error);
			console.log("新增员工失败");
			response.end("error")
		}
		else{
			console.log("新增员工成功");
			response.end("success")
		}
	})
})

//添加员工信息接口
server.get("/updatework",(request,response)=>{
	var params = url.parse(request.url,true).query;
	//重载性别 在职状态
	if(params.sex == "男"){
		params.sex = "1";
	}
	else{
		params.sex = "0";
	}
	if(params.entry == "在职"){
		params.entry = "1";
	}
	else{
		params.entry = "0";
	}
	if(params.leaveDate){
		var sqlInto = `update workersList set name="${params.name}",daseSalary="${params.daseSalary}",department="${params.department}",title="${params.title}",joinDate="${params.joinDate}",sex="${params.sex}",birthday="${params.birthday}",entry="${params.entry}",leaveDate="${params.leaveDate}" where id="${params.id}"`;
	}
	else{
		var sqlInto = `update workersList set name="${params.name}",daseSalary="${params.daseSalary}",department="${params.department}",title="${params.title}",joinDate="${params.joinDate}",sex="${params.sex}",birthday="${params.birthday}",entry="${params.entry}" where id="${params.id}"`;
	}
	sql.query(sqlInto,(error,data)=>{
		if (error) {
			console.log(error);
			console.log("修改员工失败");
			response.end("error")
		}
		else{
			console.log("修改员工成功");
			response.end("success")
		}
	})
})

//薪资页
server.get("/",(request,response)=>{
	ejs.renderFile("static/wage.html",{},(error,data)=>{
		if (error) {
			console.log(error);
			response.end(data);
		}
		else{
			response.end(data);
		}
	})
})

//获取员工信息接口
server.get("/getworker",(request,response)=>{
	sql.query(`select * from wage`,(error,data)=>{
		if (error) {
			console.log(error);
			response.send("查询失败")
		}
		else {
			//重载是否结算
			for(let item of data){
				item.isPay = item.isPay ? "已结算" : "未结算"
			}
			response.send(data);
		}
	})
})

//删除员工
server.get("/deleteworkers",(request,response)=>{
	var workerID = url.parse(request.url,true).query.id;
	sql.query(`delete from wage where id=${workerID}`,(error,data)=>{
		if (error) {
			response.end("error");
		}
		else{
			response.end("success");
		}
	})
})

//添加员工信息接口
server.get("/addworkers",(request,response)=>{
	var params = url.parse(request.url,true).query;
	//重载是否结算
	if(params.isPay == "已结算"){
		params.isPay = "1";
	}
	else{
		params.isPay = "0";
	}
	sql.query( `insert into wage (name,wage,startDate,endDate,realWage,isPay,remark) values ("${params.name}","${params.wage}","${params.startDate}","${params.endDate}","${params.realWage}","${params.isPay}","${params.remark}")`,(error,data)=>{
		if (error) {
			console.log(error);
			console.log("新增员工失败");
			response.end("error")
		}
		else{
			console.log("新增员工成功");
			response.end("success")
		}
	})
})

//添加员工信息接口
server.get("/updateworks",(request,response)=>{
	var params = url.parse(request.url,true).query;
	//重载是否结算
	if(params.isPay == "已结算"){
		params.isPay = "1";
	}
	else{
		params.isPay = "0";
	}
	sql.query(`update wage set name="${params.name}",wage="${params.wage}",startDate="${params.startDate}",endDate="${params.endDate}",realWage="${params.realWage}",isPay="${params.isPay}",remark="${params.remark}" where id="${params.id}"`,(error,data)=>{
		if (error) {
			console.log(error);
			console.log("修改员工失败");
			response.end("error")
		}
		else{
			console.log("修改员工成功");
			response.end("success")
		}
	})
})

server.listen(port);
server.use(static(`${__dirname}/static`))