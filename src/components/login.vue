<template>
  <div class="login_cont">
    <div class="login_box">
      <!--登录头像区域-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!--表单输入区域-->
      <el-form ref="loginFromRef" :model="loginForm" :rules="loginForm_rules"
               label-width="0px" class="login_from">
        <!--用户名-->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prop="name" prefix-icon="el-icon-s-custom"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-unlock" type="password"></el-input>
        </el-form-item>
        <!-- 按钮区域-->
        <el-form-item class="btnS">
          <el-button type="primary" @click="login('loginFromRef')">登录</el-button>
          <el-button type="info" @click="resetLoginForm('loginFromRef')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
    export default {
        name: 'login',
        data() {
            return {
                //登录表单数据绑定对象
                loginForm: {
                    username: 'admin',
                    password: '123456',
                },
                //表单验证规则对象
                loginForm_rules: {
                    // 验证用户名是否合法
                    username: [
                        {required: true, message: '请输入登录名称', trigger: 'blur'},
                        {min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入登录密码', trigger: 'blur'},
                        {min: 6, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur'}
                    ],
                }
            }
        },
        methods: {
            //点击重置按钮，
            resetLoginForm() {
                console.log(this);
                this.$refs.loginFromRef.resetFields();
                // this.$refs["loginFromRef"].resetFields()  两种方法
            },
            login() {
                //获取表单里面数值
                this.$refs.loginFromRef.validate(async valid => {
                    //为获取返回
                    if (!valid) return;
                    const {data: res} = await this.$http.post("login", this.loginForm);
                    // 200代表登录成功
                    if (res.meta.status !== 200) {
                        return this.$message.error("登录失败！")
                    } else {
                        //1.登录成功之后的 token，保存到客户端的 sessionStorage 中
                        //2.项目中出现登录之外的其他api接口，必须在登陆之前访问
                        //3.token 只应在当前网站打开期间生效，所以将token 保存在sessionStorage中
                        //4.通过编程导航跳转后台主页，路由地址是/home
                        this.$message.success("登录成功！");
                        window.sessionStorage.setItem('token', res.data.token);
                        this.$router.push('/Home')
                    }

                })

            }
        }
    }
</script>

<style lang="less" scoped>
  .login_cont {
    background-color: #2b4b6b;
    height: 100%;
  }

  .login_box {
    width: 450px;
    height: 350px;
    background-color: #fff;
    border-radius: 5px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }

  .btnS {
    display: flex;
    justify-content: center;
  }

  .login_from {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 30px;
    box-sizing: border-box;
  }
</style>
