<template>
  <div class="skuWrap">
    <el-table :data="skuInfoList" border v-loading="loading">
      <el-table-column
        label="序号"
        type="index"
        width="80"
        align="center"
      ></el-table-column>
      <el-table-column label="名称" prop="skuName"></el-table-column>
      <el-table-column label="价格" prop="price"></el-table-column>
      <el-table-column label="重量" prop="weight"></el-table-column>
      <el-table-column label="图片">
        <template slot-scope="{ row, $index }">
          <img :src="row.skuDefaultImg" width="100px" height="60px" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row,$index}">
          <!-- <el-button type="success" icon="el-icon-edit" size="mini"
            >修改</el-button
          > -->
          <el-button
            @click="delSkuOne(row)"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align:center"
      :total="total"
      :current-page="currentPage"
      :page-sizes="[3, 5, 7]"
      :page-size="limit"
      @current-change="changePages"
      @size-change="changeSize"
      layout="prev,pager,next,jumper, ->, sizes,total"
    ></el-pagination>
  </div>
</template>

<script>
import sku from "@/api/product/sku.js";

export default {
  name: "Sku",
  data() {
    return {
      msg: '',
      skuInfoList: [],
      limit: 3,
      total: 0,
      currentPage: 1,
      loading: false
    };
  },
  mounted() {
    this.getSkuInfoList();
  },
  methods: {
    delSkuOne(row) {
      // let result = await sku.deleteSkuOne(row.id)
      this.$confirm("此操作将永久删除该sku, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let result = await sku.deleteSkuOne(row.id);
          if (result.code === 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getSkuInfoList(
              this.skuInfoList.length - 1 >= 1
                ? this.currentPage
                : this.currentPage - 1
            );
          }else {
            this.$message({
              type: "danger",
              message: "删除失败!"
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
      //
    },
    async getSkuInfoList(page = 1) {
      this.loading = true
      this.currentPage = page;
      let { limit } = this;
      let result = await sku.getSkuList({ page, limit });
      if(result.code === 200) {
        this.loading = false
        this.skuInfoList = result.data.records;
        this.total = result.data.total;
      }
    },
    changePages(page) {
      this.getSkuInfoList(page);
    },
    changeSize(limit) {
      this.limit = limit;
      this.getSkuInfoList();
    }
  }
};
</script>

<style >
.skuWrap {
  margin: 20px;
}
</style>