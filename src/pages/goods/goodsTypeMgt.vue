<template>
    <div class="goodsTypeMgt">
        <div class="title">商品分类管理</div>
        <el-divider></el-divider>
        <div class="typeList">
            <div class="item" v-for="(item,index) in typeList" :key="item.id">
                <div class="label" v-text="item.label"></div>
                <div class="priority" v-text="'（优先级'+item.priority+'）'"></div>
                <img class="icon" :src="item.icon" alt />
                <div class="del" @click="del(index, item)">删除</div>
                <div class="modify" @click="modify(index, item)">修改</div>
            </div>
        </div>
    </div>
</template>

<script>
import { post, api } from "../../utils/httpApi";
export default {
    data() {
        return {
            typeList: [],
        };
    },
    created() {
        this.getGoodsType();
    },
    methods: {
        getGoodsType() {
            post(api.getGoodsType)
                .then((res) => {
                    let data = res.data;
                    if (data.code == 0) {
                        let _data = data.data;
                        _data.forEach((v) => {
                            let obj = {
                                label: v.title,
                                id: v.id,
                                icon: api.baseUrl + v.icon,
                                priority: v.priority,
                            };
                            this.typeList.push(obj);
                        });
                    }
                })
                .catch((err) => {
                    this.$Message.error(err);
                });
        },
        del(index, item) {
            this.$MessageBox
                .confirm("将删除该分类?", "", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                .then(() => {
                    let params = this.$qs.stringify({
                        id: item.id,
                    });
                    post(api.delGoodsType, params)
                        .then((res) => {
                            let data = res.data;
                            if (data.code == 0) {
                                this.typeList.splice(index, 1);
                                this.$Message.success(data.message);
                                return false;
                            }
                            this.$Message.error(data.message);
                        })
                        .catch((err) => {
                            this.$Message.error(err);
                        });
                })
                .catch(() => {});
        },
    },
};
</script>

<style scoped>
@import "goodsTypeMgt.css";
</style>