<template>
  <div>
    <!--  面包削导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片视图-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="根据姓名查找" v-model="queryInfo.query" clearable @clear="getUserList" @input="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialog = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!--      用户列表区域-->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="userState(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <!--            修改信息-->
            <el-tooltip effect="dark" content="修改信息" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" circle @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <!--            删除信息-->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" circle @click="removeUserByid(scope.row.id)"></el-button>
            </el-tooltip>
            <!--            分配角色-->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-star-off" circle></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--      分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 7, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!--    添加用户表格区域-->
    <el-dialog title="添加用户" :visible.sync="addDialog" width="50%" @close="AddLogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <!--        用户名-->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!--      底部-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialog = false">取 消</el-button>
    <el-button type="primary" @click="AddUser">确 定</el-button>
  </span>
    </el-dialog>
    <!--    修改用户表格区域-->
    <el-dialog title="修改用户表格" :visible.sync="editDialogVisible" width="50%">
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "Uesrs",
        data() {
            //验证邮箱的规则

            // 验证手机号
            var checkMobile = (rule, value, cb) => {
                const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
                if (regMobile.test(value)) {
                    return cb()
                }
                cb(new Error('请输入合法的手机号'))
            };
            return {
                //获取用户列表的参数
                queryInfo: {
                    query: '',
                    //当前页数
                    pagenum: 1,
                    //每页几条数据
                    pagesize: 2
                },
                userlist: [],
                total: 0,
                //用来控制添加用户信息框的隐藏与显示
                addDialog: false,
                //用来控制修改用户信息框的隐藏与显示
                editDialogVisible: false,
                //添加用户表单数据
                addForm: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: '',
                },
                //查询到的用户信息对象
                editForm: {
                    email: '',
                    mobile: '',
                },
                //添加表单验证规则对象
                addFormRules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 4, max: 12, message: '长度在 4 到 12 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 4, max: 12, message: '长度在 4 到 12 个字符', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {min: 4, max: 12, message: '长度在 4 到 12 个字符', trigger: 'blur'},
                    ],
                    mobile: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {min: 11, max: 11, message: '手机号长度为11位数字', trigger: 'blur'},
                        {validator: checkMobile, trigger: 'change'}
                    ],
                }
            }
        },
        created() {
            this.getUserList()
        },
        methods: {
            async getUserList() {
                const {data: res} = await this.$http.get('users', {params: this.queryInfo});
                if (res.meta.status !== 200) {
                    return this.$message.error("获取用户列表失败！")
                }
                this.userlist = res.data.users
                this.total = res.data.total
                console.log(res)
            },
            //监听 page
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                this.getUserList()
            },
            //监听页码值改变的事件
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage;
                this.getUserList()
            },
            async userState(userInfo) {
                console.log(userInfo);
                const {data: res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
                console.log(res.meta.status)
                if (res.meta.status !== 200) {
                    userInfo.mg_state = !userInfo.mg_state
                    return this.$message.error("获取用户状态失败")
                }
                this.$message.success("更新用户状态成功！")
            },
            //监听添加用户时关闭事件
            AddLogClosed() {
                this.$refs.addFormRef.resetFields()
            },
            //点击按钮添加新用户
            AddUser() {
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) return;
                    const {data: res} = await this.$http.post('users', this.addForm)

                    if (res.meta.status !== 201) {
                        this.$message.error('添加用户失败！')
                    }
                    this.$message.success("添加用户成功！")
                    //隐藏对话框
                    this.addDialog = false
                    //重新获取列表数据
                    this.getUserList()

                })
            },
            //展示修改信息
            async showEditDialog(id) {
                console.log(id)
                const {data: res} = await this.$http.get('users/' + id)
                if (res.meta.status !== 200) {
                    return this.$message.error('失败！')
                }
                this.editForm = res.data;
                this.editDialogVisible = true;
            },
            //修改用户信息并提交
            editUserInfo() {
                this.$refs.editFormRef.validate(async validate => {
                    if (!validate) return;
                    console.log(validate)
                    const {data: res} = await this.$http.put('users/' + this.editForm.id,
                        {
                            email: this.editForm.email,
                            mobile: this.editForm.mobile
                        });
                    console.log(res.meta.status)
                    if (res.meta.status !== 200) {
                        return this.$message.error("更新用户信息失败！")
                    }
                    this.editDialogVisible = false;
                    this.$message.success("更新用户信息成功！")
                    this.getUserList()

                })
            },
            //删除用户信息提示消息
            async removeUserByid(id) {
                const ctr = await this.$confirm('此操作将永久删除该用户信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)

                if (ctr !== 'confirm') {
                    return this.$message.info('已取消删除')
                }
                const {data: res} = await this.$http.delete('users/' + id)

                if (res.meta.status !== 200) {
                    return this.$message.error("删除用户信息失败")
                }

                this.$message.success("删除成功")
                this.getUserList()
            }
        }
    }
</script>

<style lang="less" scoped>
  .el-breadcrumb {
    margin-bottom: 20px;
  }



  .el-pagination {
    margin-top: 15px;
    text-align: center;
  }
</style>
