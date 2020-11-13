<template>
  <div class="spuWrap">
    <el-card>
      <CategorySelector @categoryIdUpdate="categoryUpdate" />
    </el-card>

    <el-card style="margin-top: 20px">
      <div v-show="index === 0">
        <el-button type="primary" :disabled="!category3Id" @click="addSpu"
          >添加SPU</el-button
        >
        <el-table :data="spuList" border>
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column label="描述" prop="description"></el-table-column>
          <el-table-column label="操作" prop="description">
            <template slot-scope="{ row, $index }">
              <HintButton
                title="添加SKU"
                type="primary"
                icon="el-icon-plus"
                size="mini"
              />
              <HintButton
                @click="updateSpu(row)"
                title="修改SPU"
                type="success"
                icon="el-icon-edit"
                size="mini"
              />
              <HintButton
                @click="showAllSku(row)"
                title="查看所有SKU"
                type="info"
                icon="el-icon-info"
                size="mini"
              />
              <el-popconfirm
                :title="`确定删除${row.spuName}吗？`"
                @confirm="deleteSpu(row)"
              >
                <HintButton
                  slot="reference"
                  title="删除SPU"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                />
              </el-popconfirm>
              <el-dialog :title="row.spuName+'=>SKU列表'" :visible.sync="dialogTableVisible">
                <el-table :data="skuList" border >
                  <el-table-column
                    label="名称"
                    property="skuName"
                  ></el-table-column>
                  <el-table-column
                    property="price"
                    label="价格"
                  ></el-table-column>
                  <el-table-column
                    property="weight"
                    label="重量"
                  ></el-table-column>
                  <el-table-column
                    label="图片"
                  >
                    <template slot-scope="{row,$index}">
                      <img :src="row.skuDefaultImg" style="width: 100px; height: 80px" />
                    </template>
                  </el-table-column>
                </el-table>
              </el-dialog>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center"
          :total="total"
          :current-page="page"
          :page-size="limit"
          :page-sizes="[3, 5, 7]"
          @current-change="pageChange"
          @size-change="sizeChange"
          layout="prev, pager, next, jumper, -> ,sizes,total"
        ></el-pagination>
      </div>
      <div v-show="index === 1">
        <SpuForm ref="spuForm" :index.sync="index" @saveSuccess="saveSuccess"/>
      </div>
    </el-card>
  </div>
</template>

<script>
import CategorySelector from "@/components/CategorySelector1";
import SpuForm from "../components/spuForm";
import SkuForm from "../components/skuForm";
import spu from "@/api/product/spu";
import sku from "@/api/product/sku";
export default {
  name: "Spu",
  components: {
    CategorySelector,
    SpuForm,
    SkuForm
  },
  data() {
    return {
      category3Id: "",
      spuList: [],
      skuList: [],
      page: 1,
      limit: 5,
      total: 0,
      index: 0,
      dialogTableVisible: false
    };
  },
  methods: {
    categoryUpdate({ flag, categoryId }) {
      if (flag !== 3) {
        this.category3Id = "";
        this.spuList = [];
      } else {
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },
    async getSpuList(page = 1) {
      this.page = page;
      let { limit, category3Id } = this;
      let spuListResultData = await spu.getSpuInfoPage(
        page,
        limit,
        category3Id
      );
      this.total = spuListResultData.data.total;
      this.spuList = spuListResultData.data.records;
    },
    pageChange(page) {
      this.getSpuList(page);
    },
    sizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    async deleteSpu(row) {
      let deleteResult = await spu.delete(row.id);
      if (deleteResult.code === 200) {
        this.$message(`删除${row.spuName}成功`);
        this.getSpuList(
          this.spuList.length - 1 >= 1 ? this.page : this.page - 1
        );
      } else {
        this.$message(`删除${row.spuName}失败`);
      }
    },
    async showAllSku(row) {
      this.dialogTableVisible = true
      let skuListResultData = await sku.getListBySpuId(row.id)
      this.skuList = skuListResultData.data
    },
    updateSpu(row) {
      this.spuId = row.id
      this.index = 1
      this.$refs.spuForm.initUpdateSpuInfo(row.id,this.category3Id)
    },
    saveSuccess() {
      this.index = 0;
      if (this.spuId) {
        this.getSpuList();
      } else {
        this.getSpuList(this.page);
      }
    },
    addSpu() {
      this.index = 1
      this.$refs.spuForm.initAddSpuInfo(this.category3Id);
    }
  }
};
</script>

<style>
.spuWrap {
  margin: 20px;
  background: #fff;
  height: 100%;
}
</style>