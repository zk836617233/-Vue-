<template>
  <el-container class="HomeContainer">
    <!--      侧面栏-->
    <el-aside :width="isColl ? '64px' : '200px'">
      <div class="toggle-button" @click="toggleCollapse">|||</div>
      <!--          侧面栏区域-->
      <el-menu background-color="#232939" text-color="#fff" active-text-color="#409bff"
               unique-opened :collapse="isColl" :collapse-transition="false"
               router :default-active="this.$route.path">
        <!--            一级菜单-->
        <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
          <!--              一级菜单模板区域-->
          <template slot="title">
            <!--                图标-->
            <i :class="iconsObj[item.id]"></i>
            <!--                文本-->
            <span>{{item.authName}}</span>
          </template>
          <!--              二级菜单-->
          <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
            <i class="el-icon-s-grid"></i>
            <span >{{subItem.authName}}</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>

    <!--    页面主体-->
    <el-container>
      <!--    头部区域-->
      <el-header height="80px">
        <div>
          <img src="../../src/assets/Vue.png" alt="">
          <span class="web-font">wjjVue后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <!--      右侧栏主题内容-->
      <el-main>
<!--        路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
    export default {
        name: "Home",
        data(){
          return{
              //左侧菜单数据
              menulist:[],
              iconsObj:{
                125:'el-icon-user',
                103:'el-icon-setting',
                101:'el-icon-goods',
                102:'el-icon-document',
                145:'el-icon-folder-opened',
              },
              isColl:false
          }
        },
        created(){
          this.getMenuList()
        },
        methods: {
            logout() {
                window.sessionStorage.clear();
                this.$router.push('login')
            },
           async getMenuList(){
               const {data: res} = await this.$http.get('menus');
               if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
               this.menulist = res.data;
            },
            //点击按钮切换导航栏收起展开
            toggleCollapse(){
                return this.isColl = !this.isColl
            },
            Onclick(){
                console.log(this.$route.path)
            }
        }
    }
</script>

<style lang="less" scoped>
  .web-font {
    font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
  }
  .toggle-button{
    background-color: #232939;
   font-size: 15px;
    color: #fff;
    height: 80px;
    line-height: 80px;
    text-align: center;
    letter-spacing: 0.1em;
    cursor: pointer;
  }
  .HomeContainer {
    height: 100%;
  }

  .el-header {
    background-color: #FFFFFF;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #232939;
    font-size: 20px;

    > div {
      display: flex;
      align-items: center;

      span {
        padding-left: 20px;
      }
    }
  }

  .el-aside {
    background-color: #232939;
    transition: width 0.4s;
    .el-menu {
      border-right:none ;
    }
  }

  .el-main {
    background-color: #F9F8FD;
  }
</style>
