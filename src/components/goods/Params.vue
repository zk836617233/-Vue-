<template>
  <div>
    <!--  面包削导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片试图-->
    <el-card>
      <!--      警告区域-->
      <el-alert title="注意：只允许为第三分类设置相关参数！" type="warning" show-icon :closable="false">
      </el-alert>
      <!--      选择商品分类-->
      <el-row class="shop_row">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectedCatKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
      <!--      tabs 页签区域-->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!--        添加动态参数属性面板-->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isBtnDisabled" @click="primaryVisible = true">添加参数</el-button>
          <!--          动态参数表格-->
          <el-table :data="manyTableData" border stripe>
            <!--            展开行-->
            <el-table-column type="expand" align="center">
              <template slot-scope="scope">
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" align="center"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" plain @click="showEditlog(scope.row.attr_id)">
                  编辑
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" plain
                           @click="removeParams(scope.row.attr_id)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--        添加静态属性属性面板-->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isBtnDisabled" @click="primaryVisible = true">添加属性</el-button>
          <!--          静态属性表格-->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand" align="center">
              <template slot-scope="scope">
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" align="center"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" plain @click="showEditlog(scope.row.attr_id)">
                  编辑
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" plain
                           @click="removeParams(scope.row.attr_id)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!--    添加动态/静态参数-->
    <el-dialog :title="'添加'+titleText" :visible.sync="primaryVisible" width="50%" @close="addDialogClose">
      <!--      表单验证-->
      <el-form :model="addFrom" :rules="addFromRules" ref="addFromRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="primaryVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
    </el-dialog>
    <!--    修改动态/静态参数-->
    <el-dialog :title="'修改'+titleText" :visible.sync="editprimaryVisible" width="50%" @close="editDialogClose">
      <!--      表单验证-->
      <el-form :model="editFrom" :rules="editFromRules" ref="editFromRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editprimaryVisible = false">取 消</el-button>
    <el-button type="primary" @click="editParams">确 定</el-button>
  </span>
    </el-dialog>


  </div>
</template>

<script>
    export default {
        name: "Params",
        data() {
            return {
                //商品分类列表
                cateList: [],
                //获取级联框的配置对象
                cateProps: {
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children',
                    expandTrigger: 'hover'
                },
                //级联选择框双向绑定数据
                selectedCatKeys: [],
                //默认页签的显示名称
                activeName: 'many',
                //动态参数数据
                manyTableData: [],
                //静态参数数据
                onlyTableData: [],
                //动态参数开关
                primaryVisible: false,
                //修改按钮开关
                editprimaryVisible: false,

                addFrom: {
                    attr_name: ''
                },
                //表单验证
                addFromRules: {
                    attr_name: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                    ],
                },
                editFrom: {},
                editFromRules: {
                    attr_name: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                    ],
                }
            }
        },
        created() {
            this.getCateList()
        },
        methods: {
            // 获取所有商品分类列表
            async getCateList() {
                const {data: res} = await this.$http.get('categories')
                if (res.meta.status !== 200) {
                    return this.$message.error('获取商品列表失败！')
                }
                this.cateList = res.data
                console.log(this.cateList)


            },
            //级联选择框触发的函数
            handleChange() {
                this.getParamsData()
            },
            //页签点击事件
            handleTabClick() {
                this.getParamsData()
            },
            //获取参数的列表数据
            async getParamsData() {
                if (this.selectedCatKeys.length !== 3) {
                    this.selectedCatKeys = []
                    return
                }

                const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`,
                    {params: {sel: this.activeName}})
                if (res.meta.status !== 200) {
                    return this.$message.error("获取列表失败！")
                }


                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : []
                    // 控制文本框的隐藏与显示
                    item.inputVisible = false
                    // 文本框输入的值
                    item.inputValue = ''

                })

                console.log(res.data)

                if (this.activeName === 'many') {
                    this.manyTableData = res.data
                } else {
                    this.onlyTableData = res.data
                }
            },
            //添加关闭事件
            addDialogClose() {
                this.$refs.addFromRef.resetFields()
            },
            editDialogClose() {
                this.$refs.editFromRef.resetFields()
            },
            //点击确定按钮添加事件
            addParams() {
                this.$refs.addFromRef.validate(async valid => {
                    if (!valid) return
                    const {data: res} = await this.$http.post(`categories/${this.cateId}/attributes`, {
                        attr_name: this.addFrom.attr_name,
                        attr_sel: this.activeName
                    })

                    if (res.meta.status !== 201) {
                        return this.$message.error('添加参数失败！')
                    }
                    this.$message.success('添加参数成功！')
                    this.primaryVisible = false
                    this.getParamsData()
                })
            },
            //编辑点击按钮
            async showEditlog(attr_id) {
                const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,
                    {params: {attr_sel: this.activeName}})

                if (res.meta.status !== 200) {
                    return this.$message.error('获取信息失败！')
                }
                this.editFrom = res.data
                this.editprimaryVisible = true

            },
            //修改表单确认按钮
            editParams() {
                this.$refs.editFromRef.validate(async valid => {
                    if (!valid) return
                    const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editFrom.attr_id}`,
                        {attr_name: this.editFrom.attr_name, attr_sel: this.activeName})

                    if (res.meta.status !== 200) {
                        return this.$message.error('修改参数失败！')
                    }
                    this.$message.success('修改参数成功！')
                    this.getParamsData()
                    this.editprimaryVisible = false
                })

            },
            //删除
            async removeParams(attr_id) {
                const confResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)

                if (confResult !== 'confirm') {
                    return this.$message.info('您已取消删除')
                }
                const {data: res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
                if (res.meta.status !== 200) {
                    this.$message.error('删除数据失败！')
                }
                this.$message.success('删除数据成功！');
                this.getParamsData()
            },
            //文本框失去焦点函数
            async handleInputConfirm(row) {
                if (row.inputValue.trim().length === 0) {
                    row.inputValue = '';
                    row.inputVisible = false;
                    return
                }
                row.attr_vals.push(row.inputValue.trim());
                row.inputValue = '';
                row.inputVisible = false;
                this.saveAttrVals(row)

                console.log('ok')
            },
            //将对 attr_vals 的操作保存数据库
            async saveAttrVals(row){
                const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
                    {
                        attr_name: row.attr_name,
                        attr_sel: row.attr_sel,
                        attr_vals: row.attr_vals.join(' ')
                    })
                if(res.meta.status !== 200){
                    return this.$message.error("修改参数失败！")
                }

                this.$message.success("修改成功！")
            },
            //点击按钮展开文本框
            showInput(row) {
                row.inputVisible = true;

                //让文本自动获取焦点
                //$nextTick 方法的作用。就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            //删除对应的属性
            handleClose(i,row){
             row.attr_vals.splice(i,1)
                this.saveAttrVals(row)
            }
        },
        computed: {
            //如果按钮被禁用，则返回true，否则返回false
            isBtnDisabled() {
                if (this.selectedCatKeys.length !== 3) {
                    return true
                }
                return false
            },
            // 当选中三级分类的Id
            cateId() {
                if (this.selectedCatKeys.length === 3) {
                    return this.selectedCatKeys[2]
                }
                return null
            },
            //动态计算标题
            titleText() {
                if (this.activeName === 'many') {
                    return '动态属性'
                } else {
                    return '静态属性'
                }
            },

        }
    }
</script>

<style scoped>
  .shop_row {
    margin: 15px 0;
    font-size: 14px;
  }

  .el-tag {
    margin-right: 10px;
    margin-top: 10px;
  }

  .input-new-tag {
    width: 130px;
    display: inline-block;
  }
</style>
