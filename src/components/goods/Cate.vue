<template>
    <div>
         <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>

            <el-row>
                <el-col>
                    <el-button type="primary" @click="openAddGoodsDialog">添加商品</el-button>
                </el-col>
            </el-row>

        <!-- 表格展示商品 -->
            <vue-table 
                ref="Vuetable"
                :data="goodsList"
                :columns="columns"

                :stripe="props.stripe"
                :border="props.border"
                :show-header="props.showHeader"
                :show-summary="props.showSummary"
                :show-row-hover="props.showRowHover"
                :show-index="props.showIndex"
                :tree-type="props.treeType"
                :is-fold="props.isFold"
                :expand-type="props.expandType"
                :selection-type="props.selectionType"
            >
            <!-- 是否有效 -->
            <template slot="isOk" slot-scope="scope">

                <i v-if="!scope.row.cat_deleted" class="el-icon-success" style="color: #67C23A;"></i>
                <i v-else class="el-icon-error" style="color: #F56C6C;"></i>
            </template>

            <!-- 排序 -->
            <template slot="order" slot-scope="scope">
                <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
                <el-tag v-else-if="scope.row.cat_level == 1" type="success">二级</el-tag>
                <el-tag v-else type="danger">三级</el-tag>
            </template>

            <!-- 操作 -->
            <template slot="todo">
                <el-button type="primary">编辑</el-button>
                <el-button type="danger">删除</el-button>
            </template>
            </vue-table>

        <!-- 分页 -->
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paramsSet.pagenum"
        :page-sizes="[3, 6, 9, 15]"
        :page-size="paramsSet.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        </el-pagination>

        
        </el-card>

        <!-- 添加商品对话框 -->

        <el-dialog
        title="添加商品"
        :visible.sync="addGoodsDialogVisible"
        width="50%"
        @close="closeAddGoodsDialog"
        >
        
        <el-form :model="goodsParamsForm" :rules="goodsParamsFormRules" ref="goodsParamsFormRef" label-width="100px" class="demo-ruleForm">
            <el-form-item label="商品名称" prop="cat_name">
                <el-input v-model="goodsParamsForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类" prop="cat_pid">
                <el-cascader
                    expand-trigger="hover"
                    :options="goodOptions"
                    v-model="selectedGoodsOptions"
                    @change="handleChange"
                    clearable
                    :props="cascaderProps"
                    change-on-select
                    >
                </el-cascader>
            </el-form-item>
        </el-form>

        
        <span slot="footer" class="dialog-footer">
            <el-button @click="addGoodsDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addGoods">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 请求的货物列表
            goodsList : [],
            paramsSet: {
                type: 3,
                pagenum: 0,
                pagesize: 3
            },
            // 商品总数
            total: 0,
            // vue-table的列属性设置
            columns: [
                {
                    label: '商品名',
                    prop: 'cat_name',
                    width: '400px',
                },
                {
                    label: '商品ID',
                    prop: 'cat_id',
                    minWidth: '50px',
                },
                {
                    label: 'cat_deleted',
                    prop: 'expand',
                    // 表示将当列设置为模板列
                    type: 'template',
                    //  该模板的名字
                    template: 'isOk'
                },
                {
                    label: '排序',
                    // 表示将当列设置为模板列
                    type: 'template',
                    //  该模板的名字
                    template: 'order'
                },
                {
                    label: '操作',
                    // 表示将当列设置为模板列
                    type: 'template',
                    //  该模板的名字
                    template: 'todo'
                }
            ],
            // vue-table配置属性
            props: {
                stripe: false,
                border: true,
                showHeader: true,
                showSummary: false,
                showRowHover: true,
                showIndex: false,
                treeType: true,
                isFold: true,
                expandType: false,
                selectionType: false,
            },

            // 控制添加商品对话框的显示与隐藏
            addGoodsDialogVisible: false,

            // 添加的商品信息
            goodsParamsForm: {
                // 默认是添加到一级
                // 分类父 ID
                cat_pid: 0,
                // 分类名称
                cat_name: '',
                // 分类层级
                cat_level: 0
            },

            // 添加商品信息的验证规则
            goodsParamsFormRules: {
                cat_name: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                    { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
                ]
            },

            // 级联下拉框的数据源
            goodOptions: [],
            // 选择的数据
            selectedGoodsOptions: [],
            // 级联下拉框的配置
            cascaderProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            }
        }
    },

    created() {

        this.getGoodList();
    },

    methods: {
        // 请求商品列表数据
        async getGoodList() {
            const { data : res } = await this.$http.get('/categories',{ params: this.paramsSet});
            this.total = res.data.total;
            if (res.meta.status != 200) return this.$message.error('请求商品列表失败');

            this.goodsList = res.data.result;

        },

        // 监听页面pagesize变化
        handleSizeChange(pageSize) {
            this.paramsSet.pagesize = pageSize;
            this.getGoodList();
        },

        //  监听当前页发生变化
        handleCurrentChange(cur) {
            this.paramsSet.pagenum = cur;
            this.getGoodList();
        },

        // 点击打开添加商品对话框
        openAddGoodsDialog() {
            // 先获取商品分类
            this.getGoodsType();
            
            this.addGoodsDialogVisible = true;
        },

        // 请求商品分类
        async getGoodsType() {
            const { data: res } = await this.$http.get('/categories',{ params: {
                type: 2
            }});
            if (res.meta.status != 200) return this.$message.error('获取商品分类失败');

            this.goodOptions = res.data;
        },

        // 级联选择下拉框一旦发生变化
        handleChange() {
            if ( this.selectedGoodsOptions.length != 0 ) {
                this.goodsParamsForm.cat_pid = this.selectedGoodsOptions[this.selectedGoodsOptions.length -1];
                this.goodsParamsForm.cat_level = this.selectedGoodsOptions.length;

            } else {
                this.goodsParamsForm.cat_pid = 0 ;
                this.goodsParamsForm.cat_level = 0 ;
            }
            
        },

        // 关闭添加商品对话框就重置
        closeAddGoodsDialog() {
            this.addGoodsDialogVisible = false;
            this.$refs.goodsParamsFormRef.resetFields();
            this.selectedGoodsOptions = [];
        },

        // 点击确定，添加商品
        addGoods() {
            // 先检查是否信息填写正确，如果填写正确才发送请求
            this.$refs.goodsParamsFormRef.validate(async valid => {
                if (!valid) return this.$message.error('请检查是否填写正确');

                const {data : res} = await this.$http.post('/categories',this.goodsParamsForm);
                console.log(res);
                if (res.meta.status != 201) return this.$message.error('添加商品失败，请重试');
                this.$message.success('添加商品成功');
                this.closeAddGoodsDialog();
                this.getGoodList();
            })
        }
    }

}
</script>

<style lang="less" scoped>

.el-row {
    margin-bottom: 35px;
}

.el-cascader {
    width: 100%;
}


</style>