<template>
    <div>

         <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!-- 搜素 -->
            <el-row>

                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodList">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="gotoAddGood">添加商品</el-button>
                </el-col>

            </el-row>

            <!-- 表格展示 -->
            <el-table
            :data="goodList"
            style="width: 100%" stripe border>
            <el-table-column
                type="index"
                label="#">
            </el-table-column>
            <el-table-column
                prop="goods_name"
                label="商品名称"
                width="180">
            </el-table-column>
            <el-table-column
                prop="goods_price"
                label="商品价格(元)"
                width="180">
            </el-table-column>
            <el-table-column
                prop="goods_weight"
                label="商品重量">
            </el-table-column>
            <el-table-column
                prop="add_time"
                label="添加时间">
                <template slot-scope="scope">
                    {{ scope.row.add_time | filterTime}}
                </template>
            </el-table-column>
            <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <el-button type="danger" @click="deleteGoodById(scope.row.goods_id)">删除</el-button>
                    <el-button type="warning">修改</el-button>
                </template>
            </el-table-column>

            </el-table>
            
            <!-- 分页 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[10, 15, 20, 30]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>

        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 查询条件
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 10
            },
            // 一共商品数量
            total: 1,
            // 查询到的商品列表
            goodList: []
        }
    },

    methods: {
        async getGoodList() {
            const {data:res} = await this.$http.get('/goods',{ params: this.queryInfo});
            if (res.meta.status != 200) {
                return this.$message.error('查询商品数据失败');
            }
            this.goodList = res.data.goods;
            this.total = res.data.total;
        },

        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize;
            this.getGoodList();
        },

        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage;
            this.getGoodList();
        },

        // 删除商品
        async deleteGoodById(id) {
            const res = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).catch( err => err);
            
        
            // 如果确定则发起删除请求
            if (res == 'confirm') {
                const {data:res} = await this.$http.delete(`goods/${id}`);
                if (res.meta.status != 200) {
                    return this.$message.error('删除失败，请重试');
                }
                this.$message.success('删除成功!');
                this.getGoodList();
            }

        },

        // 点击跳转到添加商品页面
        gotoAddGood() {
            this.$router.push('/goods/add');
        }

    },

    created() {
        this.getGoodList();
    }
}
</script>

<style lang="less" scoped>

</style>