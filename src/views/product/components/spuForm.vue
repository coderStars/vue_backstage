<template>
  <div>
    <el-form :model="spuInfo">
      <el-form-item label="SPU名称" label-width="100px">
        <el-input v-model="spuInfo.spuName" placeholder="SPU名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌" label-width="100px">
        <el-select v-model="spuInfo.tmId" placeholder="请选择品牌">
          <el-option
            :label="trademark.tmName"
            :value="trademark.id"
            v-for="(trademark, index) in trademarkList"
            :key="trademark.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述" label-width="100px">
        <el-input
          type="textarea"
          rows="4"
          v-model="spuInfo.description"
          placeholder="SPU描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片" label-width="100px">
        <template slot-scope="{row,$index}">
          <el-upload
            action="/dev-api/admin/product/fileUpload"
            list-type="picture-card"
            :file-list="spuImageList"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </template>
      </el-form-item>
      <el-form-item label="销售属性" label-width="100px">
        <el-select
          v-model="spuInfo.spuSaleAttr"
          :placeholder="unCheckedAttrList.length > 0 ? `还有${unCheckedAttrList.length}项未选择呢!` : '没啦!!!'"
          style="width: 200px; margin-right: 5px"
        >
          <el-option :label="item.name" :value="`${item.name}:${item.id}`" v-for="(item, index) in unCheckedAttrList" :key="item.id"></el-option>
        </el-select>
        <el-button @click="addSaleAttr" type="primary" icon="el-icon-plus" :disabled="!(unCheckedAttrList.length > 0)">添加销售属性</el-button>
      </el-form-item>
      <el-form-item label-width="100px">
        <el-table :data="spuInfo.spuSaleAttrList" border>
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column
            label="属性名"
            prop="saleAttrName"
            width="200"
          ></el-table-column>
          <el-table-column label="属性值名称列表">
            <template slot-scope="{ row, $index }">
              <el-tag
                v-for="(spuSaleAttrValue, index) in row.spuSaleAttrValueList"
                :key="spuSaleAttrValue.id"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index,1)"
              >
                {{ spuSaleAttrValue.saleAttrValueName }}
              </el-tag>
              <el-input
                style="width: 100px"
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                :ref="$index"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(row,$index)"
                >+添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="{row,$index}">
              <el-button
                @click="spuInfo.spuSaleAttrList.splice($index,1)"
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label-width="100px">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import spu from "@/api/product/spu";
import sku from "@/api/product/sku";
import attr from "@/api/product/attr";
import trademark from "@/api/product/trademark";
export default {
  name: "SpuForm",
  props: ['index'],
  data() {
    return {
      category3Id: '',
      dialogImageUrl: '',
      inputVisible: false,
      dialogVisible: false,
      spuInfo: {
        category3Id: 0,
        description: "string",
        id: 0,
        tmId: 0,
        spuName: "string",
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0
          // }
        ],
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0
          //     }
          //   ]
          // }
        ]
      },
      trademarkList: [],
      baseSaleAttrList: [],
      spuImageList: []
    };
  },
  computed: {
    unCheckedAttrList() {
      let attrList = this.baseSaleAttrList.filter(allItem => {
        return !this.spuInfo.spuSaleAttrList.some(item => allItem.id == item.baseSaleAttrId)
      })
      return attrList
    }
  },
  methods: {
    cancel() {
      this.$emit('update:index',0)
      this.resetData()
    },
    resetData() {
      this.category3Id = ''
      this.spuInfo = {
        description: "",
        spuImageList: [],
        spuSaleAttrList: []
      }
      this.spuImageList = []
      this.trademarkList = []
      this.baseSaleAttrList = []
    },
    async save() {
      let {spuInfo,spuImageList,category3Id} = this
      spuImageList = spuImageList.map(item => {
        return {
          imgName : item.name,
          imgUrl : item.imgUrl || item.response.data

        }
      })
      spuInfo.spuSaleAttrList.forEach(item => {
        delete item.inputVisible
        delete item.saleAttrValueName
      })

      spuInfo.spuImageList = spuImageList
      spuInfo.category3Id = category3Id

      let result
      if(spuInfo.id) {
        result = await spu.updateSpuInfo(spuInfo)

      }else {
        result = await spu.saveSpu(spuInfo)
      }

      if(result.code === 200) {
        this.$message.success('保存spu成功')
        this.$emit('saveSuccess')
        this.resetData()
      }else {
        this.$message.success('保存spu失败')
      }
    },
    async initUpdateSpuInfo(spuId,category3Id) {
      this.category3Id = category3Id
      let spuInfoResultData = await spu.getSpuBaseInfo(spuId);

      if (spuInfoResultData.code === 200) {
        this.spuInfo = spuInfoResultData.data;
      }

      let spuImageListResultData = await sku.getSpuImageList(spuId)

      if (spuImageListResultData.code === 200) {
        let templateImgList = spuImageListResultData.data.map(item => {
          item.name = item.imgName
          item.url = item.imgUrl
          return item 
        });
        this.spuImageList = templateImgList
      }

      let trademarkListResultData = await trademark.getTrademarkListAll();

      if (trademarkListResultData.code === 200) {
        this.trademarkList = trademarkListResultData.data;
      }

      let baseSaleAttrListResultData = await spu.getBaseSaleAttrList();
      if (baseSaleAttrListResultData.code === 200) {
        this.baseSaleAttrList = baseSaleAttrListResultData.data;
      }
    },
    handleClose() {
      
    },
    handleSuccess(response, file, fileList) {
      this.spuImageList = fileList
    },
    handleInputConfirm(row) {
      if(!row.inputValue) return
      //判断空值
      if(!row.inputValue.trim()) {
        this.$message('值不能为空!')
        row.inputValue = ''
        return
      }
      //判断是否和之前的相同
      let repeat = row.spuSaleAttrValueList.find(item => {
        return item.saleAttrValueName === row.inputValue
      })

      if(repeat) {
        this.$message('与之前的值重复!')
        row.inputValue = ''
        return 
      }

      row.spuSaleAttrValueList.push({
        baseSaleAttrId: row.baseSaleAttrId,
        saleAttrName: row.saleAttrName,
        saleAttrValueName: row.inputValue
      })
      row.inputValue = ''
      row.inputVisible = false
    },
    showInput(row,index) {
      this.$set(row,'inputVisible', true)

      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },
    handleRemove(file, fileList) {
      this.spuImageList = fileList
    },
    handlePictureCardPreview(file,fileList) {
      this.dialogVisible = true;

      this.dialogImageUrl = file.url
    },
    addSaleAttr() {
      let [attrName,attrId] = this.spuInfo.spuSaleAttr.split(':')
      this.spuInfo.spuSaleAttr = ''
      this.spuInfo.spuSaleAttrList.push({
        baseSaleAttrId: attrId,
        saleAttrName: attrName,
        spuId: this.spuInfo.id,
        spuSaleAttrValueList: []
      })
    }
  }
};
</script>

<style>
</style>