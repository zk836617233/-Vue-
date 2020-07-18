<template>
  <div>
    <!--  面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片试图-->
    <el-card>
      <!--        添加角色按钮-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="roleLogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolelist" border stripe>
        <el-table-column type="expand" align="center"></el-table-column>
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column label="角色名称" prop="roleName" align="center"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeRole(scope.row.id)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting">分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--    添加用户主体框-->
    <el-dialog title="添加角色" :visible.sync="roleLogVisible" width="40%" @close="AddRoleClosed">
      <!--      内容区域-->
      <el-form :model="roleForm" ref="addroleFormRef" :rules="addRoleFormRules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="roleLogVisible = false">取 消</el-button>
    <el-button type="primary" @click="AddRole">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "roles",
        data() {
            return {
                //所有列表数据
                rolelist: [],
                //添加用户开关
                roleLogVisible: false,
                //添加角色表单
                roleForm: {
                    roleName: '',
                    roleDesc: ''
                },
                //添加角色校验规则
                addRoleFormRules: {
                    roleName: {required: true, message: '请输入角色名称', trigger: 'blur'},

                    roleDesc: {required: true, message: '请输入角色描述', trigger: 'blur'},
                }
            }
        },
        created() {
            this.getRolelist()
        },
        methods: {
            async getRolelist() {
                const {data: res} = await this.$http.get('roles')
                if (res.meta.status !== 200) {
                    return this.$message.error('获取角色列表失败!')
                }
                this.rolelist = res.data

            },
            //监听关闭事件
            AddRoleClosed() {
                this.$refs.addroleFormRef.resetFields()
            },
            //添加角色
            AddRole() {
                this.$refs.addroleFormRef.validate(async valid => {
                    if (!valid) return;
                    const {data: res} = await this.$http.post('roles', this.roleForm)
                    if (res.meta.status !== 201) {
                        this.$message.error('添加角色信息失败！')
                    }
                    this.$message.success("添加角色信息成功!")
                    this.roleLogVisible = false
                    this.getRolelist()
                })
            },
            //删除角色信息
            async removeRole(id) {
                const removeRoleV = await this.$confirm('此操作将永久删除角色信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                console.log(removeRoleV)
                if (removeRoleV !== 'confirm') {
                    return this.$message.info('已取消删除')
                }

                const {data: res} = await this.$http.delete('roles/' + id)
                if (res.meta.status !== 200) {
                    return this.$message.error('失败！')
                }
                this.$message.success("删除成功")
                this.getRolelist()
            }
        }
    }
</script>

<style scoped>

</style>
