<template>
    <div class="login">
        <input type="text" class="account" placeholder="请输入账号" v-model="account">
        <input type="password" class="password" placeholder="请输入密码" v-model="password">
        <input type="button" class="submit" value="登录" @click="submit">
    </div>
</template>

<script>
    import {api, post} from "../../utils/httpApi";

    export default {
        name: "login",
        data() {
            return {
                account: "",
                password: ""
            }
        },
        created() {
            history.pushState(null, null, document.URL);
            window.addEventListener('popstate', function () {
                history.pushState(null, null, document.URL);
            });
        },
        methods: {
            submit() {
                if (this.account.length == 0) {
                    this.$toast("请输入账号");
                    return false;
                }
                if (this.password.length == 0) {
                    this.$toast("请输入密码");
                    return false;
                }
                let params = this.$qs.stringify({
                    account: this.account,
                    password: this.password
                })
                post(api.login, params).then(res => {
                    let data = res.data;
                    if (data.code == 0) {
                        this.$toast({message: "正在登录...", duration: 1400});
                        let timer = setTimeout(() => {
                            document.cookie = "SHOPSESSIONID=" + data.data;
                            document.cookie = "account=" + this.account;
                            this.$router.push({
                                path: "/Home",
                            });
                            clearTimeout(timer);
                        }, 1500);
                        return false;
                    }
                    this.$toast("账号或密码错误");
                }).catch(err => {
                    this.$toast(err.message);
                })
            }
        }
    }
</script>

<style scoped>
    @import "login.css";
</style>