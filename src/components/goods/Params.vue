<template>
    <div>
         <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <!-- 提示文本信息 -->
            <el-alert
                title="设置的商品必须属于三级分类"
                type="warning" show-icon :closable="false">
            </el-alert>

            <!-- 选择 -->
            <el-row>
                <el-col>
                    <el-tag size="medium" style="font-size: 18px; margin-right: 15px;">请选择商品的分类</el-tag>
                    <el-cascader
                        expand-trigger="hover"
                        :options="goodsList"
                        v-model="selectedGoodsOptions"
                        @change="handleGoodsChange"
                        :props="goodsProps"
                        >
                    </el-cascader>
                </el-col>
            </el-row>

            <!-- tab栏 -->
             <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button :disabled="btnIsDisable" type="primary" @click="openAddPropsDialog">添加参数</el-button>
                    <!-- 动态参数table -->
                    <el-table
                    :data="mamyInfo"
                    style="width: 100%"
                    border
                    stripe
                    >
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag closable  v-for="(item,i) in scope.row.attr_vals" :key="item"  @close="handleCloseProps(i,scope.row)">{{item}}</el-tag>
                                <!-- 动态添加tag -->
                                <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>

                        <el-table-column
                        type="index"
                        width="50"
                        label="序号">
                        </el-table-column>

                        <el-table-column
                            prop="attr_name"
                            label="属性"
                            width="180">
                        </el-table-column>

                        <el-table-column
                            label="操作"
                            width="180">
                            <template slot-scope="scope">
                                <el-button type="primary" @click="showEditProps(scope.row)">编辑</el-button>
                                <el-button type="danger" @click="removeProps(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                        
                    </el-table>
                </el-tab-pane>

                <el-tab-pane label="静态属性" name="only">
                    <el-button :disabled="btnIsDisable" type="primary" @click="openAddPropsDialog" closable>
                        添加属性
                    </el-button>

                    <!-- 静态参数 -->
                     <el-table
                        :data="onlyInfo"
                        style="width: 100%"
                        border
                        stripe
                        >
                            <el-table-column type="expand">
                                <template slot-scope="scope">
                                <el-tag closable  v-for="(item,i) in scope.row.attr_vals" :key="item"  @close="handleCloseProps(i,scope.row)">{{item}}</el-tag>
                                <!-- 动态添加tag -->
                                <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                                </template>
                            </el-table-column>

                            <el-table-column
                            type="index"
                            width="50"
                            label="序号">
                            </el-table-column>

                            <el-table-column
                                prop="attr_name"
                                label="日期"
                                width="180">
                            </el-table-column>
                            
                            <el-table-column
                            label="操作"
                            width="180">
                            <template slot-scope="scope">
                                <el-button type="primary" @click="showEditProps(scope.row)">编辑</el-button>
                                <el-button type="danger" @click="removeProps(scope.row)">删除</el-button>
                            </template>
                            
                            </el-table-column>

                     </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!-- 添加动/静态属性对话框 -->
        <el-dialog
        :title="'添加' + getTitleText"
        :visible.sync="addPropsDialogVisible"
        width="50%"
        @close="closeAddPropsDialog">
            <el-form :model="propsForm" :rules="propsRules" ref="propsFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="参数名称" prop="attr_name">
                    <el-input v-model="propsForm.attr_name"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addPropsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="clickToAddProps">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改动/静态属性对话框 -->
        <el-dialog
        :title="'修改' + getTitleText"
        :visible.sync="editPropsDialogVisible"
        width="50%"
        @close="closeEditPropsDialog">
            <el-form :model="propsForm" :rules="propsRules" ref="propsFormRef" label-width="110px" class="demo-ruleForm">
                <el-form-item label="修改属性名称" prop="attr_name">
                    <el-input v-model="propsForm.attr_name"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editPropsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="clickToEditProps">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            goodsList: [],
            // 级联选择了的
            selectedGoodsOptions:[],
            // 级联选择器的属性设置
            goodsProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            // tab栏使用的activeName
            activeName: 'many',
            // 动态参数的信息
            mamyInfo: [],
            // 静态参数新消息
            onlyInfo: [],
            // 控制添加动/静态属性对话框显示与隐藏
            addPropsDialogVisible: false,
            // 添加动静态属性对象
            propsForm: {
                id: '',  //分类 ID
                attr_name: '', //参数名称
                attr_sel: '',    //[only,many]
                attr_id: '' //属性
            },
            // 添加动静态属性验证规则
            propsRules: {
                attr_name: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                    { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
                ]
            },

            // 控制添加动/静态属性对话框显示与隐藏
            editPropsDialogVisible: false,

        }
    },

    created() {
        this.getGoodsList();
    },

    methods: {
        async getGoodsList() {
            const { data: res } = await this.$http.get('/categories',{ params: {
                type: 3
            }});
            if (res.meta.status != 200) return this.$message.error('请求商品列表失败');
            this.goodsList = res.data;
            
        },

        // 处理点击了选择的级联下拉框
        handleGoodsChange() {
            
            if (this.selectedGoodsOptions.length !== 3 ) {
                this.$message.error('请选择3级商品！');
                this.selectedGoodsOptions = [];
                this.mamyInfo = [];
                this.onlyInfo = [];
                return ;
            }
            this.getThrData();
        },

        // 处理点击了tab栏
        handleTabClick() {
           
            if (this.getThrId === null) return this.$message.error('请先选择商品')
            this.getThrData();
        },

        // 请求第三级商品的数据
        async getThrData() {
            
            const { data: res } = await this.$http.get(`categories/${this.getThrId}/attributes`,{ params: {
                sel: this.activeName
            }});
            if (res.meta.status != 200 ) return this.$message.error('请求数据失败，请重试');
            this.activeGood = res.data;
           
           
           res.data.forEach( item => {
               item.attr_vals = item.attr_vals? item.attr_vals.split(' ') : [];
               item.inputVisible = false;
               item.inputValue = '';
           });

           
            if (this.activeName === 'many') {
                this.mamyInfo = res.data;
            } else {
                this.onlyInfo = res.data;
            }
        },

        // 点击打开添加动静态属性对话框
        openAddPropsDialog() {
            this.addPropsDialogVisible = true;
            this.propsForm.id = this.getThrId;
            this.propsForm.attr_sel = this.activeName;
        },

        // 添加动/静态属性对话框 关闭状态
        closeAddPropsDialog() {
            // this.$refs.propsFormRef.resetFields();
            this.propsForm.id = '';
            this.propsForm.attr_name = '';
            this.propsForm.attr_sel = '';
            this.propsForm.attr_id = '';
        },

        // 点击添加属性
        clickToAddProps() {
            this.$refs.propsFormRef.validate( async valid => {
                if (!valid) return this.$message.error('请正确输入');

                const { data: res } = await this.$http.post(`/categories/${this.propsForm.id}/attributes`,{
                    attr_name: this.propsForm.attr_name,
                    attr_sel: this.propsForm.attr_sel
                });
                if (res.meta.status != 201 ) return this.$message.error('添加属性失败，请重新输入');
                this.$message.success('添加属性成功！');
                this.addPropsDialogVisible = false;
                // 重新获取属性
                this.getThrData();
            })
        },

        // 点击打开修改动/静态属性对话框 
        showEditProps(curGoods) {
            this.editPropsDialogVisible = true;
            // 获取数据
            this.propsForm.id = curGoods.cat_id;
            this.propsForm.attr_name = curGoods.attr_name;
            this.propsForm.attr_sel = curGoods.attr_sel;
            this.propsForm.attr_id = curGoods.attr_id;
        },

        // 关闭 修改动/静态属性对话框 
        closeEditPropsDialog() {
            this.propsForm.id = '';
            this.propsForm.attr_name = '';
            this.propsForm.attr_sel = '';
            this.propsForm.attr_id = '';
        },

        // 点击确定，修改属性
        clickToEditProps() {
            this.$refs.propsFormRef.validate( async valid => {
                if ( !valid) return this.$message.error('请正确填写！');

                const { data : res } = await this.$http.put(`/categories/${this.propsForm.id}/attributes/${this.propsForm.attr_id}`,{
                    attr_name: this.propsForm.attr_name,
                    attr_sel: this.propsForm.attr_sel
                });

                if (res.meta.status != 200) return this.$message.error('修改失败，请重试');
                this.$message.success('修改成功！');
                this.editPropsDialogVisible = false;
                // 重新请求数据
                this.getThrData();
            })
        },
        
        // 删除当前属性
        async removeProps(curGoods) {
           
            const result =   await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                            }).catch( err => err);

            if ( result != 'confirm') return this.$message({
                                                type: 'info',
                                                message: '已取消删除'
                                             });
            const { data :res } = await this.$http.delete(`categories/${curGoods.cat_id}/attributes/${curGoods.attr_id}`);
            
            if (res.meta.status != 200) return this.$message.error('删除失败，请重试');
            this.$message.success('删除参数成功！');
            this.getThrData();
        },

        // 处理动态添加tag
        handleInputConfirm(item) {
            if (item.inputValue.trim().length === 0) {
                item.inputValue = '';
                item.inputVisible = false;      
                return ;
            }
            item.attr_vals.push(item.inputValue.trim());
            item.inputValue = '';
            item.inputVisible = false;
            
            this.updataParams(item);
        },
        async updataParams(item) {
            // 插入参数
            const { data :res} = await this.$http.put(`categories/${this.getThrId}/attributes/${item.attr_id}`,{
                attr_name: item.attr_name,
                attr_sel: item.attr_sel,
                attr_vals: item.attr_vals.join(" ")
            });
            
            if (res.meta.status != 200) {
                this.$message.error("插入失败，请重试");
                return;
            }
            this.$message.success("操作成功")
        },
        showInput(item) {
            item.inputVisible = true;
            this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        // 处理关闭属性标签
        handleCloseProps(i,item) {
            item.attr_vals.splice(i,1);
            this.updataParams(item);
        }
    },

    computed: {
        // 这个计算属性给哪两个按钮使用 添加参数和添加属性
        btnIsDisable() {
            if (this.selectedGoodsOptions.length === 3)
                return false;
            return true;
        },

        // 返回第三级参数的id，如果不是第三级，返回空
        getThrId() {
            if (this.selectedGoodsOptions.length === 3)
                return this.selectedGoodsOptions[2];
            return null;
        },

        getTitleText() {
            if ( this.activeName === 'many') {
                return '动态属性';
            } else {
                return '静态属性';
            }
        }
    }
}
</script>

<style lang="less" scoped>

.el-alert {
    margin-bottom: 35px;
}

.el-tag {
    margin: 15px;
}
</style>