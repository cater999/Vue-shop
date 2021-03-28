<template>
    
    <el-container class="home-container">
        <!-- 头部 -->
        <el-header>
            <div class="header_icon">
                <img src="../assets/logo.png" alt="图标">
                <span>后台管理系统</span>
            </div>
            <el-button @click="dropOut" type="info">退出登录</el-button>
        </el-header>
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="collapseOr? ' 64px': '220px' ">
                <div class="collapseBtn" @click="clickTocollapse">|||</div>
                <el-menu background-color="#3B4144" text-color="#fff" active-text-color="#ffd04b" :unique-opened="true" :collapse="collapseOr" :collapse-transition="false" router :default-active="activeItem">
                   <el-submenu :index="item.id + '' " v-for="item in listItems" :key="item.id">
                        <template slot="title">
                            <i :class="ItemsToIcons[item.id]" style="margin-right: 15px;"></i>
                            <span v-text="item.authName"></span>
                        </template>

                        <!-- 二级路由 -->
                        <el-menu-item :index="'/' + i.path" v-for="i in item.children" :key="i.id" @click="setActiveItem('/' + i.path)">
                            <i class="el-icon-menu"></i>
                            <span v-text="i.authName"></span>
                        </el-menu-item>
                       
                    </el-submenu>            
                </el-menu>

            </el-aside>

            <!-- 右侧主体区 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>

    
</template>

<script>

export default {
    created() {
        this.getListItems();
        // 一旦刷新页面，从sessionStorage中去获取高亮的人
        this.activeItem = window.sessionStorage.getItem('activeItem');
    },
    data() {
        return {
            listItems: [],
            ItemsToIcons: {
                '125' : 'iconfont icon-241user04',
                '103' : 'iconfont icon-task-filling',
                '101' : 'iconfont icon-shop',
                '102' : 'iconfont icon-bill',
                '145' : 'iconfont icon-dataanalysis'
            },
            collapseOr: false,
            // 当前需要高亮的item
            activeItem: ''
        }
    },
    methods: {
        dropOut() {
            window.sessionStorage.clear();
            this.$router.push('/login');
        },

        async getListItems() {
            // 请求数据
            const { data : get} = await this.$http.get('menus');
            if (get.meta.status == 200) {
                // 记录成数组
                this.listItems = get.data;
                
            } else {
                this.$message.error('请求失败');
            }
        },
        
        // 点击去折叠
        clickTocollapse() {
            this.collapseOr = !this.collapseOr;
        } ,

        // 点击去设置当前高亮的item的index是谁
        setActiveItem(activeItem) {
            this.activeItem = activeItem;
            window.sessionStorage.setItem('activeItem',activeItem)
        }
     }
}

</script>

<style lang="less" scoped>

.home-container {
    height: 100%;
}

.el-header {
    display: flex;
    justify-content: space-between;
    background-color: #3B4144;
    align-items: center;
    color: #fff;
    padding-left: 0;
    >div {
        display: flex;
        align-items: center;
        height: 100%;
        >img {
            height: 100%;
        }
        >span {
            margin-left: 15px;
        }
    }
}

.el-aside {
    background-color: #3B4144;
}

.el-main {
    background-color: #E4E8EC;
}

.el-menu {
    border-right: none
}

// 折叠按钮
.collapseBtn {
    background-color: #454F61;
    font-size: 24px;
    line-height: 35px;
    text-align: center;
    word-spacing: 2em;
    cursor:pointer;
}
</style>
