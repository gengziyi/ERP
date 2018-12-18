var root = new Vue({
	el:"#root",
	data(){
		return{
			workersList:null,
			dialog:{
				visible:false,
				massageTitle:"添加员工",
				data:{
					name:"",
					daseSalary:"",
					department:"",
					title:"",
					joinDate:"",
					sex:"男",
					birthday:"",
					entry:"在职",
					leaveDate:""
				}
			},
			rules:{
				name:[
					{required:true,min:2,max:6,message:"长度在三~六个字符",trigger:"blur"}
				],
				department:[
					{required:true,message:"请输入所属部门",trigger:"blur"}
				],
				title:[
					{required:true,message:"请输入职位",trigger:"blur"}
				],
				leaveDate:[
					{required:true,message:"请选择离职时间",trigger:"blur"}
				]
			}
		}
	},
	computed:{
	},
	methods:{
		deleteworker(id){
			this.$confirm("删除后员工信息不可恢复，确认删除吗？","删除员工",{
				type:"warning",
				callback(action){
					if (action === "confirm") {
						axios.get(`http://192.168.1.107:88/deleteworker?id=${id}`).then((response)=>{
							if (response.data === "success") {
								//获取所有员工数据
								axios.get("http://192.168.1.107:88/getworkers").then((response)=>{
									root.workersList = response.data;
								})
								root.$message({
									message:"删除操作成功",
									type:"success"
								})
							}
							else {
								root.$message({
									message:"操作失败",
									type:"warning"
								})
							}
						})
					}
					else {
						root.$message({
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
					daseSalary:"",
					department:"",
					title:"",
					joinDate:"",
					sex:"男",
					birthday:"",
					entry:"在职",
					leaveDate:""
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
						axios.get("/addworker",{
							params:this.dialog.data
						}).then((response)=>{
							if(response.data == "success"){
								//获取所有员工数据
								axios.get("http://192.168.1.107:88/getworkers").then((response)=>{
									root.workersList = response.data;
								})
								this.dialog.visible = false;
								//弹出层信息初始化
								root.dialog.data = {
									name:"",
									daseSalary:"",
									department:"",
									title:"",
									joinDate:"",
									sex:"男",
									birthday:"",
									entry:"在职",
									leaveDate:""
								}
								root.$message({
									type:"success",
									message:"添加成功"
								})
							}
							else{
								root.$message({
									type:"warning",
									message:"添加失败"
								})
							}
						})
					}
					//编辑功能
					if (this.dialog.massageTitle == "编辑员工") {
						axios.get("/updatework",{
							params:this.dialog.data
						}).then((response)=>{
							if(response.data == "success"){
								//获取所有员工数据
								axios.get("http://192.168.1.107:88/getworkers").then((response)=>{
									root.workersList = response.data;
								})
								this.dialog.visible = false;
								//弹出层信息初始化
								root.dialog.data = {
									name:"",
									daseSalary:"",
									department:"",
									title:"",
									joinDate:"",
									sex:"男",
									birthday:"",
									entry:"在职",
									leaveDate:""
								}
								root.$message({
									type:"success",
									message:"修改成功"
								})
							}
							else{
								root.$message({
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
			var data = this.workersList[index];
			for(let item in data){
				this.dialog.data[item] = data[item];
			}
		}
	},
	mounted(){
		//获取所有员工数据
		axios.get("http://192.168.1.107:88/getworkers").then((response)=>{
			console.log(response.data)
			this.workersList = response.data;
		})
	}
})