<template>
  <div>
  <!--  面包屑导航-->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>权限列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!--卡片试图-->
  <el-card>
    <el-table :data="rigthsList" border stripe>
    <el-table-column type="index" align="center"></el-table-column>
      <el-table-column label="权限名称" prop="authName" align="center"></el-table-column>
      <el-table-column label="路径" prop="path" align="center"></el-table-column>
      <el-table-column label="权限等级" prop="level" align="center">
        <template slot-scope="scope">
        <el-tag  effect="dark" v-if="scope.row.level === '0'">等级一</el-tag>
        <el-tag type="success" effect="dark" v-if="scope.row.level === '1'">等级二</el-tag>
        <el-tag type="danger" effect="dark" v-if="scope.row.level === '2'">等级三</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  </div>
</template>

<script>
    export default {
        name: "Rigths",
        data() {
            return {
                //所有的权限列表
                rigthsList: []
            }
        },
        created() {
            //获取权限列表
            this.getRightsList()
        },
        methods: {
            async getRightsList() {
                const {data: res} = await this.$http.get('rights/list')
                if (res.meta.status !== 200) {
                    return this.$message.error("获取权限列表失败!")
                }
                this.rigthsList = res.data
                console.log(this.rigthsList)
            }
        },
    }
</script>

<style lang="less" scoped>

</style>
