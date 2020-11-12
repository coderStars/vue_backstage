<template>
  <div class="wrap">
    <el-form  label-width="80px" inline>
      <el-form-item label="">
        <el-input v-model="name" placeholder="用户名"></el-input>
      </el-form-item>

      <el-button type="primary" icon="el-icon-search">查询</el-button>
      <el-button >清空</el-button>

    </el-form>

      <br>

      <el-button type="primary" @click="addUser">添加</el-button>
      <el-button type="danger" disabled>批量删除</el-button>

      <el-table border style="margin:20px 0px" :data="users">
        <el-table-column type="selection"  width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column prop="username" label="用户名" width="150"></el-table-column>
        <el-table-column prop="nickName" label="用户昵称" ></el-table-column>
        <el-table-column prop="gmtCreate" label="创建时间" width="180"></el-table-column>
        <el-table-column prop="gmtModified" label="更新时间" width="180"></el-table-column>
        <el-table-column prop="prop" label="操作" width="230">
          <template slot-scope="{row,$index}">
              <HintButton type="info" size="mini" title="分配角色" icon="el-icon-user-solid"></HintButton>
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
        <el-form label-width="120px">
          <el-form-item label="用户名" >
            <el-input autocomplete="off" v-model="user.username"></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" >
            <el-input autocomplete="off" v-model="user.nickName"></el-input>
          </el-form-item>
          <el-form-item label="用户密码">
            <el-input autocomplete="off" v-model="user.password"></el-input>
          </el-form-item>
          
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showDialog1 = false">取 消</el-button>
          <el-button type="primary" @click="showDialog1 = false">确 定</el-button>
        </div>
      </el-dialog>

     





  </div>
</template>

<script>
import {getPageList,removeById,add} from '@/api/product/user.js'
export default {
  name: 'User',
  data() {
    return {
      name:"",
      page:1,
      limit:5,
      total:1,
      searchObj:{
        username:''
      },
      users:[],//用户分页列表
      showDialog1:false,//新增加用户的dialog
      user:{            //=收集新增用户的数据
        username:'',
        nickName:'',
        password:'',
      },


    }
  },
  mounted() {
    //获取用户分页列表
    this.getPageList()
  
  },
  methods: {
    //添加新用户
    async addUser(){
      //清空原数据
      this.user = {        //收集新增用户的数据
        username:'',
        nickName:'',
        password:'',
      },
      this.showDialog1 = true
      let result = await add(this.user)
      if(result.code === 20000){
        this.showDialog1 = false

      }else{
        this.showDialog1 = false
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