<template>
    <div class="login_container">
        <!-- 中间白色登录框 -->
        <div class="login_box">

            <!-- 头像区域 -->
            <div class="avatar">
                <img src="../assets/logo.png" alt="avatar">
            </div>

            <!-- 账号密码 -->
            <el-form class="form_info" :model="loginForm" :rules="rules" status-icon ref="LoginForm">
                <el-form-item prop="username">
                    <el-input  v-model='loginForm.username' prefix-icon="iconfont icon-241user04"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input  v-model='loginForm.password' prefix-icon="iconfont icon-116key" type="password"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="validateAndSend" >登录</el-button>
                    <el-button @click="resetForm" type="info">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        var validateAcc = (rule,val,callback) => {
            
            if (val == '') {
                return callback(new Error('账号不能为空'));
            }
            var uPattern = /^[a-zA-Z0-9_-]{4,16}$/;
            if (!uPattern.test(val)) {
                callback(new Error('账号格式不正确'));
            } else {
                callback();
            }
        };

        return {
            loginForm: {
                username: 'admin',
                password: '123456'
            },
            rules: {
                username: [
                    { validator: validateAcc , trigger: 'blur'}
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 3, max: 12, message: '密码不规范', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        resetForm: function() {
            this.$refs.LoginForm.resetFields();
        },
        validateAndSend(){

            this.$refs.LoginForm.validate( async valid => {
                if (!valid) {
                    this.$message.error('格式不正确，请重新输入')
                } else {
                    // 如果登录成功，则提示，并且存储token，然后进行前端路由跳转
                    const { data : res} =  await this.$http.post('login',this.loginForm);
                    this.$message({
                        message: '登录成功',
                        type: 'success'
                        });
                    // 存储token
                    window.sessionStorage.setItem('token',res.data.token);
                    // 进行跳转
                    this.$router.push('/home');
                }
            })
            
        }
        
    }
}
</script>

<style lang="less" scoped>

.login_container {
    position:relative;
    height: 100%;
    background-color: #2d4d6d;
}

.login_box {
    position: absolute;
    height: 300px;
    width: 450px;
    background-color: #fff;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
}

.avatar {
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 130px;
    height: 130px;
    border: 1px solid #ccc;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,.3);
    background-color: #fff;
    img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #ccc;
    }
}

.form_info {
    position: absolute;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 0 15px;
    .btns {
        display: flex;
        justify-content: flex-end;
    }
}
</style>