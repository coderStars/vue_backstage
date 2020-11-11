<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" icon="el-icon-plus" @click="showAddDialog"
      >添加</el-button
    >
    <!-- 表格 -->
    <el-table
      :data="trademarkList"
      style="width: 100%;margin:20px 0"
      border
      stripe
    >
      <el-table-column type="index" width="80" label="序号" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" style="width:100px;height:60px" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-edit"
            @click="showUpdateDialog(row)"
            >修改</el-button
          >
          <el-button type="danger" size="mini" icon="el-icon-delete"
          @click="deleteTrademark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      @current-change="getTrademarkList"
      @size-change="handleSizeChange"
      style="text-align:center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
    >
    </el-pagination>
    <!--增加和修改的dialog -->
    <el-dialog
      :title="form.id ? '修改品牌' : '添加品牌'"
      :visible.sync="isShowDialog"
    >
      <el-form :model="form" style="width:80%">
        <el-form-item label="品牌名称" :label-width="'100px'">
          <el-input v-model="form.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" :label-width="'100px'">
          <!-- POST /admin/product/fileUpload  上传接口-->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowDialog = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTrademark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import trademarkApi from "@/api/product/trademark.js";
export default {
  name: "Trademark",
  data() {
    return {
      page: 1,
      limit: 3,
      trademarkList: [],
      total: 0,
      isShowDialog: false,
      form: {
        tmName: "",
        logoUrl: ""
      }
    };
  },
  mounted() {
    this.getTrademarkList();
  },
  methods: {
    async getTrademarkList(page = 1) {
      this.page = page;
      const result = await trademarkApi.getPageList(this.page, this.limit);
      if (result.code === 200) {
        this.trademarkList = result.data.records;
        this.total = result.data.total;
      }
    },
    handleSizeChange(size) {
      this.limit = size;
      this.getTrademarkList();
    },
    // // 点击添加按钮
    showAddDialog() {
      this.isShowDialog = true;
      //最后添加这个解决添加完成后数据依然存在在form当中的bug
      this.form = {
        tmName: "",
        logoUrl: ""
      }
    },
    //点击确定按钮添加或者修改trademark的请求逻辑
    async addOrUpdateTrademark() {
      //获取参数
      let trademark = this.form;
      //整理参数
      //发请求
      const result = await trademarkApi.addOrUpdate(trademark)
      if(result.code === 200){
        //成功干啥
        this.$message.success(`${trademark.id? '修改':'添加'}品牌成功`)
        this.isShowDialog = false
        this.getTrademarkList(trademark.id? this.page : 1)
      }else{
        //失败干啥
        this.$message.error(`${trademark.id? '修改':'添加'}品牌失败`)
      }
      
    },
    // 点击修改按钮
    showUpdateDialog(row){
      this.isShowDialog = true;
      this.form = {...row}//浅拷贝
    },
    //点击删除按钮删除品牌
    deleteTrademark(row){
      this.$confirm(`你确定删除${row.tmName}吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const result = await trademarkApi.delete(row.id)
          if(result.code === 200){
            this.$message.success('删除成功!');
            this.getTrademarkList(this.trademarkList.length>1? this.page : this.page-1);
          }else{
            this.$message.success('删除失败!');
          }

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },



    //上传成功的回调函数
    handleAvatarSuccess(res, file) {
      //上传成功后，会返回上传成功的图片的真实的路径
      //我们需要做的很简单就是把这个图片的路径赶紧收集起来
      // console.log(res,file,URL.createObjectURL(file.raw))
      this.form.logoUrl = res.data;
    },
    //在上传之前可以对上传的文件做限制
    beforeAvatarUpload(file) {
      const typeArr = ["image/jpeg", "image/png"];
      const isJPGOrPNG = typeArr.some(item => item === file.type);
      const isLt500K = file.size / 1024 < 500;

      if (!isJPGOrPNG) {
        this.$message.error("上传头像图片只能是 JPG或者PNG 格式!");
      }
      if (!isLt500K) {
        this.$message.error("上传头像图片大小不能超过 500K!");
      }
      return isJPGOrPNG && isLt500K;
    }
  }
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
