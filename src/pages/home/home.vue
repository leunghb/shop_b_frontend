<template>
    <div class="home">
        <div class="left">
            <div class="nav">
                <div :class="['item', navActive == item.path ? 'active':'']" v-for="(item,index) in nav"
                     @click="selectNav(item.path)">
                    <div class="label" v-text="item.label"></div>
                </div>
            </div>
            <div class="logout" @click="logout">退出</div>
        </div>
        <div class="right">
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view>
        </div>
    </div>
</template>

<script>
    import {clearAllCookie} from "../../utils/common";

    export default {
        name: "home",
        data() {
            return {
                nav: [{
                    label: "首页",
                    path: "/Index"
                }, {
                    label: "商品管理",
                    path: "/Goods"
                }, {
                    label: "订单管理",
                    path: "/Order"
                }],
                navActive: "/Home",
            }
        },
        created() {
            this.navActive = this.$route.path;
        },
        methods: {
            selectNav(path) {
                this.navActive = path;
                this.$router.push({
                    path: path
                })
            },
            logout() {
                this.$MessageBox.confirm('点击确认将退出', '确认退出？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    localStorage.clear();
                    clearAllCookie();
                    this.$router.replace({
                        path: "/Login"
                    })
                }).catch(() => {

                });
            }
        }
    }
</script>

<style scoped>
    @import "home.css";
</style>