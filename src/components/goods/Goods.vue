<template>
  <div>
    <!--  面包削导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--      卡片-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <!--      表格区域-->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格" prop="goods_price" width="85px" align="center"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="80px" align="center"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="170px" align="center">
          <template slot-scope="scope">
            {{scope.row.add_time | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeByid(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--      分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total" background>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
    export default {
        name: "Goods",
        data() {
            return {
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 10
                },
                //商品列表
                goodsList: [],
                //总数据条数
                total: 0,

            }
        },
        created() {
            this.getGoodsList()
        },
        methods: {
            //根域分页获取对应的商品列表
            async getGoodsList() {
                const {data: res} = await this.$http.get('goods', {params: this.queryInfo})
                if (res.meta.status !== 200) {
                    return this.$message.error('获取失败！')
                }
                this.$message.success("获取列表成功！")
                console.log(res.data)
                this.goodsList = res.data.goods
                this.total = res.data.total
            },
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                this.getGoodsList()
            },
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                this.getGoodsList()
            },
            async removeByid(id){
               const conf =  await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch( err => err)

                if(conf !== 'confirm'){
                   return  this.$message.info('已取消删除！')
                }

               const {data: res} = await this.$http.delete(`goods/${id}`)

                if(res.meta.status !== 200){
                   return  this.$message.error('删除失败！')
                }
                this.getGoodsList()
                this.$message.success("删除成功！")
            },
            goAddpage(){
                this.$router.push('/goods/add')
            }
        }
    }
</script>

<style scoped>

</style>
