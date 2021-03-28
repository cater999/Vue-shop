<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>   

        <!-- 大盒子装用户列表和分页搜素 -->
        <el-card class="box-card">   
            <el-row :gutter="40">
                <el-col :span="12">
                    <!-- 输入和搜素 -->
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="8">
                    <el-button type="primary" @click="openaddUser">添加用户</el-button>
                </el-col>
            </el-row>

            <!-- 表格用户列表展示 -->
            <el-table :data="userList" stripe style="width: 80%" border>
                <el-table-column prop="create_time" label="日期" width="180">
                </el-table-column>
                <el-table-column prop="username" label="姓名" width="180">
                </el-table-column>
                <el-table-column prop="email" label="邮箱">
                </el-table-column>
                <el-table-column prop="id" label="id">
                </el-table-column>
                <el-table-column prop="email" label="email">
                </el-table-column>
                <el-table-column prop="role_name" label="角色">
                </el-table-column>
                <el-table-column prop="mg_state" label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="changeStatus(scope.row)"></el-switch>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width=200px>
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="openEditUser(scope.row.id)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="confirmDelete(scope.row.id)"></el-button>
                        <el-tooltip class="item" effect="dark" content="设置" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-share" size="mini" ></el-button>
                        </el-tooltip>
                        
                    </template>
                </el-table-column>

            </el-table>
            
            <!-- 分页功能 -->
            <div class="block">
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
                </el-pagination>
            </div>

        </el-card>

        <!-- 添加用户对话框 -->
        <el-dialog title="收货地址" :visible.sync="dialogFormVisible" @close="closeDialog">

            <el-form :model="addUserForm" ref="addUserForm" label-width="100px" :rules="addUserRules" status-icon> 
                <el-form-item label="用户名" prop="username">
                    <el-input autocomplete="off" v-model="addUserForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="username">
                    <el-input autocomplete="off" v-model="addUserForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input autocomplete="off" v-model="addUserForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input autocomplete="off" v-model="addUserForm.mobile"></el-input>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 修改用户对话框 -->
        <el-dialog
        title="修改用户信息"
        :visible.sync="dialogUserVisible"
        width="30%" @close="closeEditUserDialog">
        
            <el-form :model="editUserForm" status-icon :rules="editUserRules" ref="editUserFormRef" label-width="100px">
                <el-form-item label="id">
                    <el-input v-model="editUserForm.id" autocomplete="off" disabled></el-input>
                </el-form-item>

                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editUserForm.email" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editUserForm.mobile"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogUserVisible = false">取 消</el-button>
                <el-button type="primary" @click="comfireEditUser">确 定</el-button>
            </span>
        
        </el-dialog>
    </div>
</template>

<script>
export default {
    
    created() {
        this.getUserList();
    },

    data() {
        var checkEmail = (rule,val,callback) => {
            if(!(/^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/.test(val))){ 
                callback(new Error('邮箱不合法')) 
                
            } else {
                callback();
            }
        }

        var checkPhone = (rule,val,callback) => {
            if(!(/^1[3456789]\d{9}$/.test(val))){ 
                callback(new Error('手机号不合法')) 
                
            } else {
                callback();
            }
        }

        return {
            queryInfo: {
                query: '',
                pagenum: 1, //页数
                pagesize: 10  //每页多少个
            },
            userList: [],
            total: 0,
            dialogFormVisible: false,//用户添加对话框阀门
            dialogUserVisible: false, // 修改用户对话框阀门
            // 添加用户的表单
            addUserForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            editUserForm: {

            },
            addUserRules: {
                username: [
                    { required: true, message: '年龄不能为空',trigger: 'blur'},
                    { min: 3 , max: 12}
                ],
                password: [
                    { required: true, message: '密码不能为空',trigger: 'blur'},
                    { min: 3 , max: 12}
                ],
                email: [
                   { validator: checkEmail , trigger: 'blur'}
                ],
                mobile: [
                    { validator: checkPhone , trigger: 'blur'}
                ]
            },
            editUserRules: {
                email: [
                    { validator: checkEmail,trigger: 'blur'}
                ],
                mobile: [
                    { validator: checkPhone , trigger: 'blur'}
                ]
            }
        }
    },
    methods: {
       async getUserList() {
            const get = await this.$http.get('/users',{ params: this.queryInfo});
            if ( get.status != 200) {
                this.$message.error('用户列表请求失败');
            } else {
                this.userList = get.data.data.users;
                this.total = get.data.data.total
                console.log(this.userList);
            }
        },

        handleSizeChange(val) {
            
            this.queryInfo.pagesize = val;
            this.getUserList();
        },

        handleCurrentChange(val) {
            
            this.queryInfo.pagenum = val;
            this.getUserList();
        },

        async changeStatus(row) {
            
            const res = await this.$http.put(`users/${row.id}
            /state/${row.mg_state}`);
            if ( res.status != 200) {
                row.mg_state = ! row.mg_state ;
                this.$message.error('修改用户状态失败');
            } else {
                this.$message({
                message: '修改用户状态成功',
                type: 'success'
                })
            }
        },

        // 打开添加用户
        openaddUser() {
            this.dialogFormVisible = true;
        },

        // 关闭添加用户的对话框
        closeDialog() {
            this.$refs.addUserForm.resetFields();
        },

        // 添加用户
        addUser() {
            this.$refs.addUserForm.validate( async valid => {
               if ( !valid) return ;
               const { data: res} = await this.$http.post('/users',this.addUserForm);

                if ( res.meta.status != 201) {
                    this.$message.error('创建用户失败');
                } else {
                    this.$message.success('创建用户成功！');
                    this.dialogFormVisible = false;
                    this.getUserList();
                }
            })
        },

        // 打开编辑对话框
        async openEditUser(id) {
            this.dialogUserVisible = true;
           
            const {data : res} = await this.$http.get('/users/' + id);
            
            if (res.meta.status != 200) {
               return this.$message.error('获取用户信息失败');
            }
            this.editUserForm = res.data;
        },

        // 点击取消修改用户对话框，就重置
        closeEditUserDialog() {
            this.$refs.editUserFormRef.resetFields();
        },

        // 点击确认修改
        comfireEditUser() {
            this.$refs.editUserFormRef.validate( async validate => {
                if ( !validate)
                    return this.$message.error('修改用户失败，请检查');

                const res = await this.$http.put('/users/'+ this.editUserForm.id,{
                    email: this.editUserForm.email,
                    mobile: this.editUserForm.mobile
                })
                 
                if (res.status != 200)
                    return this.$message.error('修改用户失败，请检查');
                this.$message.success('修改用户信息成功！');
                this.dialogUserVisible = false;
                this.getUserList();
                })  
        },

        // 点击确认删除用户
        confirmDelete(id) {
            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(async () => {
                    
                    const get = await this.$http.delete('/users/' + id);
                    console.log(get);
                    if ( get.status == 200) {
                        this.getUserList();
                         this.$message({
                        type: 'success',
                        message: '删除成功!'
                        });
                        
                    } else {
                         this.$message.error('删除用户失败');
                    }
                   

                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        }

    }
}
</script>

<style lang="less" scoped>

.el-breadcrumb {
    margin-bottom: 25px;
}

.el-table {
    margin-top: 35px;
}


</style>