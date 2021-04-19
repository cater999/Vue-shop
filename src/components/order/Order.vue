<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>  

        <!-- card -->
        <el-card>
            <!-- 搜素 -->
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4"></el-col>
            </el-row>

            <!-- 数据列表展示 -->
            <el-table
            :data="orderList"
            style="width: 100%">
            <el-table-column
                type="index">
            </el-table-column>
            <el-table-column
                prop="order_number"
                label="订单编号"
                width="180">
            </el-table-column>
            <el-table-column
                prop="order_price"
                label="订单价格">
            </el-table-column>
            <el-table-column
                prop="order_pay"
                label="是否付款">
            </el-table-column>
            <el-table-column
                label="是否发货">
                <template slot-scope="scope">
                    <el-tag type="danger" v-if="scope.row.is_send === '否'">{{scope.row.is_send}}</el-tag>
                    <el-tag type="success" v-else>{{scope.row.is_send}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="create_time"
                label="下单时间">
            <template slot-scope="scope">
                {{ scope.row.create_time | filterTime}}
            </template>
            </el-table-column>
            <el-table-column
                label="操作">
            <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" circle @click="openEditDialog"></el-button>
                <el-button type="danger" icon="el-icon-delete" circle @click="openWuliuDialog"></el-button>
            </template>
            </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[10, 15, 20, 330]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>

            <!-- 修改对话框 -->
            <el-dialog
            title="编辑"
            :visible.sync="editDialogVisible"
            width="50%">
            
            <el-form ref="form" :model="editForm" label-width="80px">
                <el-form-item label="地区选择">
                    <el-cascader v-model="editForm.area" :options="cityData"  :props="{ expandTrigger: 'hover' }"></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址">
                    <el-input v-model="editForm.detailArea"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeEditDialog">取 消</el-button>
                <el-button type="primary" @click="closeEditDialog">确 定</el-button>
            </span>
            </el-dialog>

            <!-- 物流对话框 -->
            <el-dialog
            title="物流信息"
            :visible.sync="wuliuDialogVisible"
            width="50%">
            <span>物流信息</span>

            <span slot="footer" class="dialog-footer">
                <el-button @click="wuliuDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="wuliuDialogVisible = false">确 定</el-button>
            </span>
            </el-dialog>

        </el-card>
    </div>
</template>

<script>
import cityData from './citydata'

export default {
    data() {
        return {
            queryInfo: {
                pagenum: 1,
                pagesize: 10,
                query: ''
            },
            // 一共多少订单
            total: 0,
            // 订单列表
            orderList: [],
            // 控制修改对话框
            editDialogVisible: false,
            // 对话框数据
            editForm: {
                area: [],
                detailArea: ''
            },
            cityData,

            // 物流对话框
            wuliuDialogVisible: false,
            // 物流信息
            wuliuData: []
        }
    },

    created() {
        this.getOrderList();
    },

    methods: {
        async getOrderList() {
            const { data: res} = await this.$http.get('orders',{
                params: this.queryInfo
            });
            if (res.meta.status !== 200) {
                return this.$message.error("获取订单列表数据失败");
            }
            this.total = res.data.total;
            this.orderList = res.data.goods;
            
        },

        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize;
            this.getOrderList();
        },

        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage;
            this.getOrderList();
        },

        openEditDialog() {
            this.editDialogVisible = true;
        },

        closeEditDialog() {
            this.editForm.area = [];
            this.editForm.detailArea = '';
            this.editDialogVisible = false;;
        },

        // 物流信息对话框
        async openWuliuDialog() {
            this.wuliuDialogVisible = true;
            // const {data: res} = await this.$http.get('kuaidi/1106975712662');
            // if (res.meta.status !== 200) return this.$message.error("获取物流信息失败");
            // this.wuliuData = res.data;
            // console.log(this.wuliuData);
        }
    }
}
</script>

<style lang="less" scoped>

</style>