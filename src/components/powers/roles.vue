<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb> 

        <el-card>
            <el-button type="primary">添加角色</el-button>

            <!-- 角色列表 -->
            <el-table
            :data="rolesList"
            style="width: 50%" border stripe>

                <!-- 展开 -->
                <el-table-column  type="expand">
                    <template slot-scope="scope">

                        <el-row v-for="(item,index) in scope.row.children" :key="index" :class="[ 'tag-bottom', index === 0 ? 'tag-top' : '' ]">
                            <!-- 一级权限 -->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row,item.id)">{{item.authName}}</el-tag>
                                <i class="el-icon-arrow-right"></i>
                            </el-col>

                            <!-- 二级和三级权限 -->
                            <el-col :span="19">
                                
                                <el-row v-for="(sec,i) in item.children" :key="sec.id" :class="[  i === 0 ? '' : 'tag-top' ]">
                                    <!-- 二级权限 -->
                                    <el-col :span="8">
                                        <el-tag type="success" closable @close="removeRightById(scope.row,sec.id)">{{sec.authName}}</el-tag>
                                        <i class="el-icon-arrow-right"></i>
                                    </el-col>
                                    <!-- 三级级权限 -->
                                    <el-col :span="16">
                                         
                                        <el-tag type="info" v-for="thr in sec.children" :key="thr.id" closable @close="removeRightById(scope.row,thr.id)">{{thr.authName}}</el-tag>
                                         
                                    </el-col>
                                </el-row>

                            </el-col>
                        </el-row>

                    </template>
                </el-table-column>

                <el-table-column
                    prop="roleName"
                    label="角色名称"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="roleDesc"
                    label="角色描述"
                    width="180">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete">删除</el-button>
                        <el-button type="success" icon="el-icon-search" @click="openAssignDialog(scope.row)">分配</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 分配权限对话框 -->
        <el-dialog
        title="权限列表"
        :visible.sync="assignDialogVisible"
        width="50%"
        >
            <el-tree :data="rightsList" ref="powerTreeRef" :props="treeProps" show-checkbox default-expand-all node-key="id" :default-checked-keys=checkedKeys></el-tree>
            <span slot="footer" class="dialog-footer">
            <el-button @click="assignDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="assignPower">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            rolesList: [],
            // 控制分配权限对话框的显示和隐藏
            assignDialogVisible: false,
            // 权限列表
            rightsList: [],
            // 树形控件需要用到的props树形
            treeProps:{
                children: 'children',
                label: 'authName'
            },
            // 默认选中的结点
            checkedKeys: [],
            // 分配的权限
            assignPowerKeys: [],
            // 当前对话框的roleId
            roleId: ''
        }
    },

    created() {
        this.getRoleList();
    },

    methods: {
        // 请求用户列表数据
        async getRoleList () {
            const get = await this.$http.get('roles');
            
            if (get.status != 200) return this.$message.console.error(('请求角色列表失败'));
            
            this.rolesList = get.data.data;
            
        },

        // 点击按钮弹出是否删除权限的对象框
        async removeRightById(role,rightId) {
            const res = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).catch( err => err);

            if ( res === 'confirm') {
                const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
                console.log(res);
                if (res.meta.status != 200) 
                    return this.$message.error('删除角色权限失败');
                this.$message.success('删除角色权限成功');
                // 注意这里不要调用getRoleList函数
                role.children = res.data;
            }
        },

        // 获取三级结点的id
        getThrNode(role) {
            // 先置空
            this.checkedKeys = [];
             // 打开的同时，将三级列表的值赋给checkedKeys
            role.children.forEach( item1 => {
                item1.children.forEach( item2 => {
                    item2.children.forEach( item3 => {
                        this.checkedKeys.push(item3.id);
                    })
                })
            });
        },

        // 打开分配权限的对话框
        async openAssignDialog(role) {

            //  存储当前roleId
            this.roleId = role.id;
            const {data: res} = await this.$http.get('/rights/tree');
            if (res.meta.status != 200) return this.$message.error('获取权限失败');

            this.rightsList = res.data;
            
         // 获取三级id
            this.getThrNode(role);
            
            this.assignDialogVisible = true;

            
        },

        
        // 点击确认进行分配权限
        async assignPower() {
        
            this.assignPowerKeys = [...this.$refs.powerTreeRef.getCheckedKeys(),
            ...this.$refs.powerTreeRef.getHalfCheckedKeys()];
            
            const get = await this.$http.post('roles/'+this.roleId+'/rights',{
                rids: this.assignPowerKeys.join(',')
            });
            console.log(get);
            console.log(this.assignPowerKeys);
            if (get.data.meta.status != 200) return this.$message.error('分配权限失败');
            this.$message.success('分配权限成功!');
            // 重新获取
            this.getRoleList();
            this.assignDialogVisible = false;
            
        }

    }
}
</script>

<style lang="less" scoped>

.el-table {
    margin-top: 35px;
}

.el-tag {
    margin: 15px;
}

.tag-top {
    border-top:1px solid #eee;
}

.tag-bottom {
    border-bottom: 1px solid #eee;
}

.el-row {
    display: flex;
    align-items: center;
}
</style>