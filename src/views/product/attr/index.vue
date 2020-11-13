<template>
  <div>
    <CategorySelector @handlerCategory="handlerCategory" :isShowList="isShowList"></CategorySelector>
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
              <el-popconfirm
                :title="`确定删除${row.attrName}吗？`"
                @confirm="deleteAttr(row)"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  title="删除属性"
                  size="mini"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowList">
        <!-- 添加和修改的页面 -->
        <el-form :inline="true" :model="attr">
          <el-form-item label="属性名">
            <el-input v-model="attr.attrName" placeholder="请输入属性名"></el-input>
          </el-form-item>
        </el-form>

        <el-button type="primary" ic on="el-icon-plus" @click="addAttrValue" :disabled="!attr.attrName">添加属性值</el-button>
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
              <el-input :ref="$index" v-if="row.isEdit" v-model="row.valueName" placeholder="请输入属性值" size="mini" @blur="toLook(row)" @keyup.enter.native="toLook(row)"></el-input>
              <span v-else @click="toEdit(row,$index)" style="display:block;">{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="width">
            <template slot-scope="{row,$index}">
              <el-popconfirm
                :title="`确定删除${row.valueName}吗？`"
                @confirm="attr.attrValueList.splice($index,1)"
              >
              <!-- @onConfirm="attr.attrValueList.splice($index, 1)" -->
              <!-- @onConfirm="console.log(1)" -->
                <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  title="删除属性值"
                  size="mini"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="save" :disabled="attr.attrValueList.length===0">保存</el-button>
        <el-button @click="isShowList = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import CategorySelector from "@/components/CategorySelector";
import attrAPI from "@/api/product/attr.js";
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
    async deleteAttr(row){
      const result = await attrAPI.delete(row.id)
      if(result.code === 200){
        this.$message.success('删除属性成功')
        this.getAttrList()
      }else{
        this.$message.error('删除属性失败')
      }
    },

    async save(){
      let attr = this.attr

      attr.attrValueList = attr.attrValueList.filter(item => {
        if(item.valueName !== ''){
          delete item.isEdit
          return true
        }
      })

      if(attr.attrValueList.length === 0) return 

      const result = await attrAPI.addOrUpdate(attr)
      if(result.code === 200){
        this.$message.success('保存属性成功')
        this.isShowList = true
        this.getAttrList()
      }else{
        this.$message.error('保存属性失败')
      }
    },

    // input失去焦点或者回车之后变为查看模式
    toLook(row){
      if(row.valueName.trim() === ''){
        this.$message.error('输入的数据不能为空')
        return
      }

      let isRepeat = this.attr.attrValueList.some(item => {
        if(item !== row){
          return item.valueName === row.valueName
        }
      })
      if(isRepeat){
        this.$message.error('输入的数据不能重复')
        row.valueName = ''
        return 
      }
      row.isEdit = false
    },

    // 点击span，变为编辑模式
    toEdit(attrValue,index){
      attrValue.isEdit = true

      // 让对应的input自动获取到焦点
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },

    // addAttrValue点击添加属性的回调
    addAttrValue(){
      this.attr.attrValueList.push({
        // 收集属性值的时候，我们做法是现在属性值列表当中
        attrId: this.attr.id || undefined,
        id: 0,
        valueName: "",       
        isEdit: true,
      })

      this.$nextTick(() => {
        this.$refs[this.attr.attrValueList.length-1].focus()
      })
    },

    // 点击列表页的添加属性逻辑
    showAddDiv(){
      this.isShowList = false
      this.attr = {
        attrName: '',
        categoryLevel: 3,
        attrValueList: [],
        categoryId: this.category3Id,     // 收集categoryId 不能在data当中去写
      }
    },

    showUpdateDiv(row){
      this.isShowList = false
      // this.attr = {...row}
      this.attr = cloneDeep(row)

      this.attr.attrValueList.forEach(item => {
        // item.isEdit = false     // 不是响应式属性
        this.$set(item, 'isEdit', false)
      })
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
      const result = await attrAPI.getList(category1Id, category2Id, category3Id);
      if (result.code === 200) {
        this.attrList = result.data;
      }
    },
  },
};
</script>

<style>
</style>