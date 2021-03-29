<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>   

        <!-- 展示权限列表 -->
        <el-card>
            <el-table
            :data="rightsList"
            style="width: 50%" stripe border>
            <el-table-column
                prop="authName"
                label="权限名称"
                width="180">
            </el-table-column>
            <el-table-column
                prop="path"
                label="路径"
                width="180">
            </el-table-column>
            <el-table-column
                prop="level"
                label="登记">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.level == 0">标签一</el-tag>
                    <el-tag type="success" v-else-if="scope.row.level == 1">标签二</el-tag>
                    <el-tag type="info" v-else>标签三</el-tag>
                </template>
            </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            rightsList: []
        }
    },

    created() {
        this.getRightList();
    },

    methods: {
        // 获取 用户列表
        async getRightList() {
            
            const { data: res } =  await this.$http.get('rights/list');
            if ( res.meta.status != 200) return this.$message.console.error(('请求权限列表失败'));
            this.rightsList = res.data;
            console.log(this.rightsList );
        }
    }
}
</script>

<style lang="less" scoped>

.el-breadcrumb {
    margin-bottom: 35px;
}
</style>