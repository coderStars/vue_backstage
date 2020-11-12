<template>
  <div>
    <CategorySelector @handlerCategory="handlerCategory"></CategorySelector>
    <el-card style="margin: 0 20px">
      <!-- 列表数据展示的内容 -->
      <div v-show="isShowList">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          style="margin-bottom: 15px"
          @click="showAddDiv"
          >添加属性</el-button
        >

        <el-table :data="attrList" border style="width: 100%;">
          <el-table-column type="index" label="序号" align="center" width="80">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
              >
                {{ attrValue.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{row, $index}">
              <el-button
                type="warning"
                icon="el-icon-edit"
                title="修改属性"
                size="mini"
                @click="showUpdateDiv(row)"
              ></el-button> 
              <el-button
                type="danger"
                icon="el-icon-delete"
                title="删除属性"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
      </div>
      <div v-show="!isShowList">
        <!-- 添加和修改的页面 -->
        <el-form :inline="true" :model="attr">
          <el-form-item label="属性名">
            <el-input v-model="attr.attrName" placeholder="请输入属性名"></el-input>
          </el-form-item>
        </el-form>

        <el-button type="primary" ic on="el-icon-plus" @click="addAttrValue">添加属性值</el-button>
        <el-button @click="isShowList = true" >取消</el-button>

        <el-table
          :data="attr.attrValueList"
          style="width: 100%; margin: 20px 0;"
          border>
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center">
          </el-table-column>
          <el-table-column
            prop="prop"
            label="属性值名称"
            width="width">
            <template slot-scope="{row,$index}">
              <el-input v-model="row.valueName" placeholder="请输入属性值" size="mini"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="width">
            <template slot-scope="{row,$index}">
              <el-button
                type="danger"
                icon="el-icon-delete"
                title="删除属性值"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button @click="isShowList = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import CategorySelector from "@/components/CategorySelector";
import attr from "@/api/product/attr.js";
export default {
  name: "Attr",
  components: {
    CategorySelector,
  },
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      isShowList: true,

      attr:{
        attrName: '',
        categoryLevel: 3,

        attrValueList: [],
        categoryId: 0,
      }
    };
  },
  methods: {
    // addAttrValue点击添加属性的回调
    addAttrValue(){
      this.attr.attrValueList.push({
        // 收集属性值的时候，我们做法是现在属性值列表当中
        attrId: this.attr.id || undefined,
        id: 0,
        valueName: "",        
      })
    },

    // 点击列表页的添加属性逻辑
    showAddDiv(){
      this.isShowList = false
      this.attr = {
        attrName: '',
        categoryLevel: 3,
        attrValueList: [],
        categoryId: 0,
      }
    },
    showUpdateDiv(row){
      this.isShowList = false
      this.attr = {...row}
      // this.attr = cloneDeep(row)
    },
    handlerCategory({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId;
      } else if (level === 2) {
        this.category2Id = categoryId;
      } else {
        this.category3Id = categoryId;
        //发请求，获取数据
        this.getAttrList();
      }
    },

    async getAttrList() {
      let { category1Id, category2Id, category3Id } = this;
      const result = await attr.getList(category1Id, category2Id, category3Id);
      if (result.code === 200) {
        this.attrList = result.data;
      }
    },
  },
};
</script>

<style>
</style>