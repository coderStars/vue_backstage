<template>
  <div class="wrap">
    <el-form  label-width="80px" inline>
      <el-form-item label="">
        <el-input v-model="tempSearchObj.username" placeholder="用户名"></el-input>
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="toSearch">查询</el-button>
      <el-button @click="reset">清空</el-button>

    </el-form>

      <br>

      <el-button type="primary" @click="add">添加</el-button>
      <el-button type="danger" :disabled="selectedIds.length === 0" @click="deleteSome">批量删除</el-button>

      <el-table border style="margin:20px 0px" :data="users" @selection-change="handleSelectionChange">
        <el-table-column type="selection"  width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column prop="username" label="用户名" width="150"></el-table-column>
        <el-table-column prop="nickName" label="用户昵称" ></el-table-column>
        <el-table-column prop="gmtCreate" label="创建时间" width="180"></el-table-column>
        <el-table-column prop="gmtModified" label="更新时间" width="180"></el-table-column>
        <el-table-column prop="prop" label="操作" width="230">
          <template slot-scope="{row,$index}">
              <HintButton type="info" size="mini" title="分配角色" icon="el-icon-user-solid" @click="showAssignRole"></HintButton>
              <el-popconfirm title="这是一段内容确定删除吗？"  @confirm="removeUser(row)">
               <HintButton type="danger" size="mini" title="删除用户" icon="el-icon-delete" slot="reference"></HintButton>
              </el-popconfirm>
             
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
       @current-change="getPageList"
      @size-change="handleSizeChange"
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5, 10, 20, 30]"
      layout="prev, pager, next, jumper, ->, sizes, total"
      />

      <!-- 增加一个新用户的dialog -->
      <el-dialog title="添加用户" :visible.sync="showDialog1">
        <el-form  label-width="120px" :model="user" ref="addUser">
          <el-form-item label="用户名" prop="username">
            <el-input autocomplete="off" v-model="user.username"></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickName">
            <el-input autocomplete="off" v-model="user.nickName"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password">
            <el-input autocomplete="off" v-model="user.password"></el-input>
          </el-form-item>
          
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showDialog1 = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 分配用户的dialog2 -->
      <el-dialog title="设置角色" :visible.sync="showDialog2">
        <el-form >
          <el-form-item label="用户名" :label-width="'80px'" >
            <el-input autocomplete="off" disabled></el-input>
          </el-form-item>
           <el-form-item label="角色列表" :label-width="'80px'">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="item in allRolesList" :label="item" :key="item.id">{{item.roleName}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
                  
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="assignRoles">保存</el-button>
          <el-button @click="showDialog2 = false">取 消</el-button>
          
        </div>
      </el-dialog>

     





  </div>
</template>

<script>
import {getPageList,removeById,add,getRoles,assignRoles,removeUsers,getById} from '@/api/product/user.js'
import LoginMiniVue from '../login/pages/LoginMini.vue';
export default {
  name: 'User',
  data() {
    return {
      name:"",
      page:1,
      limit:5,
      total:1,
      searchObj:{ //直接获取
        username:''
      },
      tempSearchObj:{ //查询的条件
        username:""
      },
      users:[],//用户分页列表
      showDialog1:false,//新增加用户的dialog1
      showDialog2:false,//分配用户的dialog2
      user:{            //=收集新增用户的数据
        username:'',
        nickName:'',
        password:'',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {  min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
        ],
        nickName: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
        ]
      },
      checkAll: false,
      checkedCities: [] , //用户角色的id列表
      // cities: cityOptions,
      allRolesList:[],//用户角色信息
      isIndeterminate: false,
      selectedIds:[],//所有选择的user的id的数组
       
    };
  },
  mounted() {
    //获取用户分页列表
    this.getPageList()
  
  },
  methods: {
    //清空的回调
    reset(){
      this.searchObj = {
        username: ''
      }
      this.tempSearchObj = {
        username: ''
      }
      this.getPageList()
    },
    //查询的回调
    toSearch(){
      this.searchObj = {...this.tempSearchObj}
      this.getPageList()
    },
    // 列表选中状态发生改变
    handleSelectionChange(selection){
      this.selectedIds = selection.map(item => item.id)
    },
    //批量删除
    deleteSome(){
      this.$confirm('确定删除吗？')
        .then(async()=>{
          let result = await removeUsers(this.selectedIds)
          this.$message.success('删除成功')
          this.getPageList(this.users.length>1?this.page:this.page -1)
        })
        .catch(()=>{
          this.$message.success('删除失败')
        })
    },
    //给用户分配角色
    async assignRoles(){
      console.log('准备处理的数据',this.checkedCities);
      let arr = this.checkedCities.map(item => item.id)
      let roleIds = arr.join(',')
      let result = await assignRoles(1,roleIds)
      if(result.code === 20000){
        this.showDialog2 = false
        this.$message.success('分配角色成功')
      }else{
        this.$message.success('分配角色失败')
      }
    },
    //获取某个用户的所有角色
    async getRoles(){
      this.users.userId = 1
      let result = await getRoles(1)
      if(result.code === 20000){
        this.allRolesList = result.data.allRolesList
      }

    },
    // 多选框
    handleCheckAllChange(val) {
        this.checkedCities = val ? this.allRolesList : [];
        this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.allRolesList.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.allRolesList.length;
    },
    //显示分配角色
    showAssignRole(){
      this.showDialog2 = true
      this.getRoles()
    },
    //添加新用户
        async addUser(){
            this.showDialog1 = true
            let result = await add(this.user)
            if(result.code === 20000){
              this.$message.success('添加成功')
              this.showDialog1 = false
              this.getPageList()
            }else{
              his.$message.success('添加失败')
              this.showDialog1 = false
            }
          
        
      

    },
    //点击准备添加新用户 
    add(){
      this.showDialog1 = true,
        // 清空原数据
       this.user = {     
        username:'',
        nickName:'',
        password:'',
      }
    },
    //删除用户
    async removeUser(row){
      let result = await removeById(row.id)
      if(result.code === 20000){
        this.$message.success('删除成功')
        this.getPageList(this.users.length>1?this.page:this.page -1)
      }else{
         this.$message.success('删除失败')
      }
    },
    //分页器选择limit
    handleSizeChange(size){
      this.limit = size;
      this.getPageList()
    },
    //获取用户分页列表
    async getPageList(pagee =1){
      this.page = pagee
      let result =  await getPageList(this.page,this.limit,this.searchObj)
      if(result.code === 20000){
        this.users = result.data.items
        this.total = result.data.total
      }
    }
  },
}
</script>

<style scoped >
.wrap{
  height: 100%;
  height: 100%;
  padding: 40px 40px;
  background-color: #fff;
}
</style>