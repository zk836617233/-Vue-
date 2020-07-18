<template>
  <div>
    <!--  面包削导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片试图-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="showAddCatelog">添加分类</el-button>
        </el-col>
      </el-row>
      <!--        主视图表格部分-->
      <tree-table :data="cateList" :columns="columns" :show-index="true"
                  :selection-type="false" :expand-type="false" index-text="#" class="tree-table" border>
        <!--        是否有效-->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" style="color: lightgreen " v-if="scope.row.cat_deleted === false"></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <!--        排序-->
        <template slot="sequence" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!--      分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total" type="center">
      </el-pagination>
      <!--      添加分类对话框-->
      <el-dialog title="添加分类" :visible.sync="addCateLogVisible" width="50%" @close="addCateDiaClose">
        <!--        添加分类表单-->
        <el-form :model="addCateForm" :rules="CateFormRules" ref="CateFormRef" label-width="100px">
          <el-form-item label="分类名称 :" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类 :">
            <!--options代表数据源 -->
            <el-cascader
              v-model="selectedKeys"
              :options="parentCateList"
              :props="CasCaDerProps"
              @change="parentCateChange"></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="addCateLogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParentCate">确 定</el-button>
  </span>
      </el-dialog>
    </el-card>
  </div>

</template>

<script>
    export default {
        name: "Cate",
        data() {
            return {
                querInfo: {
                    type: 3,
                    pagenum: 1,
                    pagesize: 5
                },
                //商品分类数据列表
                cateList: [],
                total: 0,
                addCateLogVisible: false,
                //为table指定列的定义
                columns: [{
                    label: '分类名称',
                    prop: 'cat_name',
                },
                    {
                        label: '是否有效',
                        type: 'template',
                        template: 'isok'
                    },
                    {
                        label: '排序',
                        type: 'template',
                        template: 'sequence'
                    },
                    {
                        label: '操作',
                        type: 'template',
                        template: 'opt'
                    }
                ],
                CateFormRules: {
                    cat_name: [
                        {required: true, message: '请输入分类名称', trigger: 'blur'}
                    ],
                },
                addCateForm: {
                    cat_name: '',
                    cat_id: '',
                    cat_leven: ''
                },
                //父级分类列表
                parentCateList: [],

                CasCaDerProps: {
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                selectedKeys: [],

            }
        },
        created() {
            this.getCateList()
        },
        methods: {
            //获取商品分类数据
            async getCateList() {
                const {data: res} = await this.$http.get('categories', {params: this.querInfo})
                if (res.meta.status !== 200) {
                    return this.$message.error('商品分类数据获取失败！')

                }
                console.log(res.data)
                //把数据列表，复制给cateList
                this.cateList = res.data.result
                this.total = res.data.total
            },
            //监听 pagesize 改变
            handleSizeChange(newSize) {
                this.querInfo.pagesize = newSize
                this.getCateList()
            },
            // 监听 pagenum
            handleCurrentChange(newnum) {
                this.querInfo.pagenum = newnum
                this.getCateList()
            },

            // 获取父级分类的列表数据
            async getParentCateList() {
                const {data: res} = await this.$http.get('categories', {params: {type: 2}})

                if (res.meta.status !== 200) {
                    return this.$message.error("获取父级列表数据失败！")
                }
                this.parentCateList = res.data
            },
            showAddCatelog() {
                this.getParentCateList()
                this.addCateLogVisible = true

            },
            //选项触发
            parentCateChange() {
                //如果 selectedKeys 数组中 length 大于0，证明选中父级分类
                //反之。就说明没有选中父级
                console.log(this.selectedKeys)
                if (this.selectedKeys.length > 0) {
                    //父级分类的id
                    this.addCateForm.cat_id =
                        this.selectedKeys[this.selectedKeys.length - 1]
                    //为当前分类的等级赋值
                    this.addCateForm.cat_leven = this.selectedKeys.length;
                } else {
                    //父级分类的id
                    this.addCateForm.cat_id = 0
                    //为当前分类的等级赋值
                    this.addCateForm.cat_leven = 0
                }
            },
            //添加角色的确定按钮
            addParentCate() {
                this.$refs.CateFormRef.validate(async valid => {
                    if (!valid) return
                 const {data: res} = await this.$http.post('categories',this.addCateForm)
                    console.log(res)
                    if (res.meta.status !== 201){
                        return this.$message.error("添加分类失败！")
                    }
                    this.$message.success("添加分类成功！")
                    this.getCateList()
                    this.addCateLogVisible = false
                })

            },
            //监听对话框关闭事件，重置表单数据
            addCateDiaClose() {
                this.$refs.CateFormRef.resetFields()
                this.selectedKeys = []
                this.addCateForm.cat_id = this.addCateForm.cat_leven = 0
            }
        }
    }
</script>

<style scoped>
  .tree-table {
    margin-top: 15px;
  }

  .el-pagination {
    margin-top: 15px;
    text-align: center;
  }
</style>
