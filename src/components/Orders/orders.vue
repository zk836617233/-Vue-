<template>
  <div>
    <!--  面包削导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--      卡片试图-->
    <el-card>
      <el-row>
        <el-col :span="8">
          <!--      搜索区域-->
          <el-input placeholder="请输入内容" v-model="queryInput" class="showInput">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
        <!--        表格区域-->
        <el-table border stripe :data="orderlist">
          <el-table-column type="index" align="center"></el-table-column>
          <el-table-column label="订单编号" prop="order_number" ></el-table-column>
          <el-table-column label="订单价格" prop="order_price" width="90px" align="center"></el-table-column>
          <el-table-column label="是否付款" prop="pay_status" width="80px">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.pay_status === 1">已付款</el-tag>
              <el-tag type="danger" v-else>未付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="是否发货" prop="is_send" width="80px" align="center"></el-table-column>
          <el-table-column label="下单时间" prop="create_time" width="200px" align="center">
            <template slot-scope="scope">
              {{scope.row.create_time | dataFormat}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140px" align="center">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="address"></el-button>
              <el-button type="success" icon="el-icon-location" size="mini" @click="showProgress"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[10, 15]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total" align="center" background>
        </el-pagination>

    </el-card>
    <!--    修改地址对话框-->
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="addressClose">
      <el-form :model="addressForm" :rules="addressRules" ref="addressFormRef" label-width="100px" >
        <el-form-item label="省市区/县" prop="address1">
            <el-cascader :options="city" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addressVisible = false">取 消</el-button>
    <el-button type="primary" @click="addressVisible = false">确 定</el-button>
    </span>
    </el-dialog>
<!--    展示物流对话框-->
    <el-dialog title="物流进度" :visible.sync="ProgressVisible" width="50%">
<!--      时间线-->
      <el-timeline >
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
  import citydata from "./citydata";

    export default {
        name: "orders",
        data() {
            return {
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 10
                },
                total: 0,
                orderlist: [],
                queryInput: '',
                // 对话框显示
                addressVisible:false,
                //物流
                ProgressVisible:false,
                addressForm:{
                    address1:[],
                    address2:''
                },
                addressRules:{
                    address1:[
                        {required: true, message: '请选择省市区/县', trigger: 'blur'},
                    ],
                    address2:[
                        {required: true, message: '请填写详细地址', trigger: 'blur'},
                    ]
                },
                city:citydata,
                progressInfo:[]
            }
        },
        created() {
            this.getOrdList()
        },
        methods: {
            //获取列表
            async getOrdList() {
                const {data: res} = await this.$http.get('orders', {params: this.queryInfo});

                if (res.meta.status !== 200) {
                    return this.$message.error('获取订单列表！')
                }
                this.total = res.data.total;
                this.orderlist = res.data.goods;
                console.log(res)
            },
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                this.getOrdList()
            },
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                this.getOrdList()
            },
            //修改地址
            address() {
                this.addressVisible = true

            },
            //关闭清空表单
            addressClose(){
                this.$refs.addressFormRef.resetFields()
            },
            //物流对话框
            async showProgress(){
              const {data: res} = await this.$http.get('/kuaidi/804909574412544580')
                console.log(res)
                if(res.meta.status !== 200){
                    return this.$message.error('获物流信息失败！')
                }
                this.progressInfo = res.data

                this.ProgressVisible = true;
            }
        }
    }
</script>

<style scoped>
  .showInput {
    width: 300px;
  }

</style>
