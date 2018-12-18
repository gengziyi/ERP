var wrap = new Vue({
	el:"#wrap",
	data(){
		return{
			wage:null,
			dialog:{
				visible:false,
				massageTitle:"添加员工",
				data:{
					name:"",
					wage:"",
					startDate:"",
					endDate:"",
					realWage:"",
					isPay:"未结算",
					remark:""
				}
			},
			rules:{
				name:[
					{required:true,min:2,max:6,message:"长度在三~六个字符",trigger:"blur"}
				],
				wage:[
					{required:true,message:"请输入应发工资",trigger:"blur"}
				],
				startDate:[
					{required:true,message:"请选择起始日期",trigger:"blur"}
				],
				endDate:[
					{required:true,message:"请选择终止日期",trigger:"blur"}
				],
				realWage:[
					{required:true,message:"请输入实发工资",trigger:"blur"}
				]
			}
		}
	},
	methods:{
		deleteworkers(id){
			this.$confirm("删除后员工信息不可恢复，确认删除吗？","删除员工",{
				type:"warning",
				callback(action){
					if (action === "confirm") {
						axios.get(`http://192.168.1.107:88/deleteworkers?id=${id}`).then((response)=>{
							if (response.data === "success") {
								//获取所有员工数据
								axios.get("http://192.168.1.107:88/getworker").then((response)=>{
									wrap.wage = response.data;
								})
								wrap.$message({
									message:"删除操作成功",
									type:"success"
								})
							}
							else {
								wrap.$message({
									message:"操作失败",
									type:"warning"
								})
							}
						})
					}
					else {
						wrap.$message({
							message:"取消操作"
						})
					}
				}
			})
		},
		//配置弹出层信息
		add(){
			this.dialog = {
				visible:true,
				massageTitle:"添加员工",
				data:{
					name:"",
					wage:"",
					startDate:"",
					endDate:"",
					realWage:"",
					isPay:"未结算",
					remark:""
				}
			}
		},
		//弹出层中添加按钮
		submit(){
			this.$refs.dialog.validate((result)=>{
				//验证通过
				if (result) {
					//添加功能
					if (this.dialog.massageTitle == "添加员工") {
						axios.get("/addworkers",{
							params:this.dialog.data
						}).then((response)=>{
							if(response.data == "success"){
								//获取所有员工数据
								axios.get("http://192.168.1.107:88/getworker").then((response)=>{
									wrap.wage = response.data;
								})
								this.dialog.visible = false;
								//弹出层信息初始化
								wrap.dialog.data = {
									name:"",
									wage:"",
									startDate:"",
									endDate:"",
									realWage:"",
									isPay:"未结算",
									remark:""
								}
								wrap.$message({
									type:"success",
									message:"添加成功"
								})
							}
							else{
								wrap.$message({
									type:"warning",
									message:"添加失败"
								})
							}
						})
					}
					//编辑功能
					if (this.dialog.massageTitle == "编辑员工") {
						axios.get("/updateworks",{
							params:this.dialog.data
						}).then((response)=>{
							if(response.data == "success"){
								//获取所有员工数据
								axios.get("http://192.168.1.107:88/getworker").then((response)=>{
									wrap.wage = response.data;
								})
								this.dialog.visible = false;
								//弹出层信息初始化
								wrap.dialog.data = {
									name:"",
									wage:"",
									startDate:"",
									endDate:"",
									realWage:"",
									isPay:"未结算",
									remark:""
								}
								wrap.$message({
									type:"success",
									message:"修改成功"
								})
							}
							else{
								wrap.$message({
									type:"warning",
									message:"修改失败"
								})
							}
						})
					}
				}
			})
		},
		//弹出层取消按钮时间
		cancle(){
			this.dialog.visible = false;
			this.$message({
				message:"取消操作"
			})
		},
		//配置编辑按钮弹出层内容
		editInfo(index){
			this.dialog.visible = true;
			this.dialog.massageTitle = "编辑员工";
			var data = this.wage[index];
			for(let item in data){
				this.dialog.data[item] = data[item];
			}
		}
	},
	mounted(){
		//获取所有员工数据
		axios.get("http://192.168.1.107:88/getworker").then((response)=>{
			console.log(response.data)
			this.wage = response.data;
		})
	}
})