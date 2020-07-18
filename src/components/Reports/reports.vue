<template>
    <div>
      <!--  面包削导航区-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>数据报表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button @click="add">123</el-button>
      <!--      卡片试图-->
      <el-card>
        <!-- 2.为 ECharts 准备一个具备大小（宽高）的 DOM -->
        <div id="main" style="width: 950px;height:450px;"></div>
      </el-card>
    </div>
</template>

<script>
  //1 .导入 echarts
  import echarts from 'echarts'
  import _ from 'lodash'

    export default {
        name: "reports",
        data(){
            return{
                //需要合并数据
                options: {
                    title: {
                        text: '用户来源'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#E9EEF3'
                            }
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            boundaryGap: false
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ]
                }

            }
        },
        created() {

        },
        //此时，页面上的元素都已经被渲染完毕了！
         mounted(){
           this.Echarts()

        },
        methods:{
          async Echarts(){
            // 3.基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('main'));

            const {data: res} = await this.$http.get('reports/type/1')

            console.log(res.data)

            if(res.meta.status !== 200){
              return this.$message.error('获取折线图数据失败!')
            }
            // 4. 准备数据和配置项
              const result = _.merge(res.data,this.options)


            // 5.展示数据

            myChart.setOption(result);
          },

          add(){

            this.Echarts()
          }
        }
    }
</script>

<style scoped>

</style>
