<template>
    <div class="home">
        <div class="left">
            <div class="nav">
                <div :class="['item', navActive == index ? 'active':'']" v-for="(item,index) in nav"
                     @click="selectNav(index, item.path)">
                    <div class="label" v-text="item.label"></div>
                </div>
            </div>
            <div class="logout" @click="logout">退出</div>
        </div>
        <div class="right">
            <router-view></router-view>
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
                    path: "/"
                }, {
                    label: "用户管理",
                    path: "/User"
                }, {
                    label: "商品管理",
                    path: "/Goods"
                }, {
                    label: "订单管理",
                    path: "/Order"
                }],
                navActive: 0,
            }
        },
        created() {

        },
        methods: {
            selectNav(index, path) {
                this.navActive = index;
                this.$router.push({
                    path: path
                })
            },
            logout() {
                this.$dialog.confirm({
                    title: '确认退出？',
                })
                    .then(() => {
                        localStorage.clear();
                        clearAllCookie();
                        this.$router.replace({
                            path: "/Login"
                        })
                    })
                    .catch(() => {
                    });
            }
        }
    }
</script>

<style scoped>
    @import "home.css";
</style>