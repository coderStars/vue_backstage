<template>
  <el-form :inline="true">
    <el-form-item label="一级分类">
      <el-select v-model="category1Id" placeholder="请选择" @change="category1Change">
        <el-option
          :label="category1Item.name"
          :value="category1Item.id"
          v-for="(category1Item, index) in category1List"
          :key="category1Item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="二级分类">
      <el-select v-model="category2Id" placeholder="请选择" @change="category2Change">
        <el-option :label="category2Item.name" :value="category2Item.id" v-for="(category2Item, index) in category2List" :key="category2Item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="三级分类">
      <el-select v-model="category3Id" placeholder="请选择" @change="catgegory3Change">
        <el-option :label="category3Item.name" :value="category3Item.id" v-for="(category3Item, index) in category3List" :key="category3Item.id"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
import Category from "@/api/category";
export default {
  name: "CategorySelector",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      category1List: [],
      category2List: [],
      category3List: []
    };
  },
  mounted() {
    this.getCategory1List();
  },
  methods: {
    async getCategory1List() {
      let resultCategory1List = await Category.getCategorys1();
      this.category1List = resultCategory1List.data;
    },
    async category1Change() {
      this.category2Id = ''
      this.category3Id = ''
      this.category2List = []
      this.category3List = []
      this.$emit('categoryIdUpdate',{categoryId: this.category1Id,flag: 1})
      let resultCategory2List = await Category.getCategorys2(this.category1Id)
      this.category2List = resultCategory2List.data
    },
    async category2Change() {
      this.category3Id = ''
      this.category3List = []
      this.$emit('categoryIdUpdate',{categoryId: this.category2Id,flag: 2})
      let resultCategory3List = await Category.getCategorys3(this.category2Id)
      this.category3List = resultCategory3List.data
    },
    catgegory3Change() {
      this.$emit('categoryIdUpdate',{categoryId: this.category3Id,flag: 3})
    }
  }
};
</script>

<style scoped>
</style>