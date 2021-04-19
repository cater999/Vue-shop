<template>
    <div>
         <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
            <el-breadcrumb-item>商品添加</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!-- 提示 -->
            <el-alert
                title="添加商品"
                type="info" center :closable="false">
            </el-alert>

            <!-- 步骤条 -->
            <el-steps :active="activeIndex - '0'" align-center>
            <el-step title="步骤1" description="基本信息"></el-step>
            <el-step title="步骤2" description="商品参数"></el-step>
            <el-step title="步骤3" description="商品属性"></el-step>
            <el-step title="步骤4" description="商品图片"></el-step>
            <el-step title="步骤5" description="商品内容"></el-step>
            <el-step title="步骤6" description="完成"></el-step>
            </el-steps>

            <!-- tabs栏 -->
            <el-form ref="form" :model="addGoodForm" :rules="addGoodrules" label-width="80px" label-position="top">
            <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeLeave" @tab-click="tabClick">
                <el-tab-pane label="基本信息" name="0">
                    <el-form-item label="商品名称" prop="goods_name">
                        <el-input v-model="addGoodForm.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" prop="goods_price">
                        <el-input v-model="addGoodForm.goods_price" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" prop="goods_number">
                        <el-input v-model="addGoodForm.goods_number" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量" prop="goods_weight">
                        <el-input v-model="addGoodForm.goods_weight" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类" prop="goods_weight">
                    <el-cascader
                        expand-trigger="hover"
                        :options="goodList"
                        v-model="addGoodForm.goods_cat"
                        :props="selectProps"
                        @change="handleSelectChange">
                    </el-cascader>
                    </el-form-item>
                </el-tab-pane>

                <el-tab-pane label="商品参数" name="1">
                    <el-form-item :label="param.attr_name" v-for="param in paramsList" :key="param.attr_id">
                        <el-checkbox-group v-model="param.attr_vals">
                            <el-checkbox border :label="val" v-for="(val,i) in param.attr_vals" :key="i"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品属性" name="2">
                    <el-form-item :label="item.attr_name" v-for="item in onlyParamsList" :key="item.attr_id">
                        <el-input v-model="item.attr_vals"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品图片" name="3">
                    <el-upload
                    :action="uploadURL"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :file-list="fileList"
                    :headers="headersObj"
                    :on-success="markURL"
                    list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-tab-pane>
                <el-tab-pane label="商品内容" name="4">

                    <quill-editor v-model="addGoodForm.goods_introduce"
                                    ref="myQuillEditor"
                                    @blur="onEditorBlur($event)"
                                    @focus="onEditorFocus($event)"
                                    @ready="onEditorReady($event)">
                    </quill-editor>
                    <el-button @click="addGood" >提交</el-button>
                </el-tab-pane>
            </el-tabs>
            </el-form>

            <!-- 展示图片对话框 -->
            <el-dialog
            title="提示"
            :visible.sync="dialogPicVisible"
            width="50%"
            >
            <img :src="previewURL" alt="pic" style="width: 100%">
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import _ from 'lodash'

export default {
    data() {
        return {
            activeIndex: "0",
            // 添加商品的表单属性
            addGoodForm: {
                goods_name: '',
                goods_price: 0,
                goods_number: 0,
                goods_weight: 0,
                pics: [],
                goods_introduce: '',
                // 级联选择的数据，要求是3个数据
                goods_cat: [],
                attrs: []

            },
            // 添加商品的表单验证规则
            addGoodrules: {
                goods_name: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' },
                    { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
                ],
                goods_price: [
                    { required: true, message: '请输入商品价格', trigger: 'blur' },
                    
                ],
                goods_number: [
                    { required: true, message: '请输入商品数量', trigger: 'blur' },
                    
                ],
                goods_weight: [
                    { required: true, message: '请输入商品重量', trigger: 'blur' },
                    
                ]
            },
            // 商品列表数据
            goodList : [],
            selectProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            // 当前商品分类的参数列表
            paramsList: [],
            // 当前商品分类的静态参数列表
            onlyParamsList: [],

            // 上传图片的URL地址
            uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
            // 记录已经上传多少张图片
            fileList: [],
            // 设置请求头
            headersObj: {
                Authorization: window.sessionStorage.getItem('token')
            },
            // 展示图片的URL
            previewURL: '',
            // 控制展示图片对话框
            dialogPicVisible: false
        }
    },
    created() {
        this.getGoodList();
    },
    methods: {
        async getGoodList() {
            const { data : res} = await this.$http.get('/categories');
            if (res.meta.status !== 200) {
                return this.$,message.error("获取商品列表数据失败");
            }
            this.goodList = res.data
        },
        // 处理级联选择
        handleSelectChange() {
            if (this.addGoodForm.goods_cat.length !== 3 ) {
                this.addGoodForm.goods_cat = [];
                return this.$message.error("请选择三级商品");
            }
        },
        // 处理tab栏切换前
        beforeLeave(activeName,oldActiveName) {
            if (oldActiveName === '0' && this.addGoodForm.goods_cat.length !== 3) {
                this.$message.error("请先选择三级分类");
                return false
            }
        },

        // 处理点击tab
        async tabClick() {
            
            if ( this.activeIndex == 1 ) {
                const {data:res} = await this.$http.get(`categories/${this.goodId}/attributes`,{
                    params: {sel: 'many'}
                });
                
                if (res.meta.status !== 200) {
                    return this.$message.error("获取参数列表失败");
                }
               
                // 将字符串转为数组
                res.data.forEach( item => {
                    item.attr_vals = item.attr_vals.length===0 ? [] : item.attr_vals.split(" ");
                })
                this.paramsList = res.data;
                console.log(this.paramsList);
            }

            if ( this.activeIndex == 2 ) {
            const {data:res} = await this.$http.get(`categories/${this.goodId}/attributes`,{
                params: {sel: 'only'}
            });
            
            if (res.meta.status !== 200) {
                return this.$message.error("获取静态参数列表失败");
            }
            
            this.onlyParamsList = res.data;
           
            }
        },

        // 处理图片函数
        handlePreview(file) {
            this.previewURL = file.response.data.url;
            this.dialogPicVisible =true
        },
        // 移除图片
        handleRemove(file, fileList) {
            // 找到路径
            const removeURL = file.response.data.tmp_path;
            const index = this.addGoodForm.pics.findIndex( x => {
                return x.pic === removeURL;
            });
            // 移除
            this.addGoodForm.pics.splice(index,1);
        },
        // 一旦图片上传成功，记录临时路径
        markURL(response, file, fileList) {
            this.addGoodForm.pics.push({
                pic: response.data.tmp_path
            })
            
        },

        // 富文本
        onEditorBlur(quill) {
            console.log('editor blur!', quill)
        },
        onEditorFocus(quill) {
            console.log('editor focus!', quill)
        },
        onEditorReady(quill) {
            console.log('editor ready!', quill)
        },

        // 添加商品
        addGood() {
            this.$refs.form.validate( async valid => {
                if (!valid) 
                    return this.$message.error("请填写必要字段");
                
                const deepForm = _.cloneDeep(this.addGoodForm);
                deepForm.goods_cat = deepForm.goods_cat.join(",")
                console.log(deepForm);
                // 处理动态属性
                this.paramsList.forEach( item => {
                    this.addGoodForm.attrs.push({
                        attr_id : item["attr_id"],
                        attr_value: item["attr_vals"].join(" ")
                    })
                })
                // 处理静态属性
                this.onlyParamsList.forEach( item => {
                    this.addGoodForm.attrs.push({
                        "attr_id": item["attr_id"],
                        "attr_value": item["attr_vals"]
                    })
                });
                deepForm.attrs = this.addGoodForm.attrs;
                
                const {data:res} = await this.$http.post('goods',deepForm);
                if (res.meta.status !== 201)
                    return this.$message.error("添加商品失败，请重试");
                this.$router.push('/goods')
            })  
            
        }
    },

    computed: {
        goodId() {
            if (this.addGoodForm.goods_cat.length === 3 ) {
                return this.addGoodForm.goods_cat[2]
            }
            return null
        }
    }
}
</script>

<style lang="less" scoped>

.el-tabs--left {
    margin: 60px 0;
}

.el-steps {
    margin: 30px 0;
}

.el-input {
    width: 450px;
}

.el-checkbox  {
    margin: 0 10px !important;
}

.ql-editor{
    height: 500px!important;
}
</style>