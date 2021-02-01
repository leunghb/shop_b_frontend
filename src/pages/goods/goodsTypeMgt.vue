<template>
    <div class="goodsTypeMgt">
        <div class="title">商品分类管理</div>
        <el-divider></el-divider>
        <el-button @click="operate = 0; showPopover = true">添加</el-button>
        <div class="typeList">
            <div class="item" v-for="(item,index) in typeList" :key="item.id">
                <div class="label" v-text="item.label"></div>
                <div class="priority" v-text="'（优先级'+item.priority+'）'"></div>
                <img class="icon" :src="item.icon" alt />
                <div class="del" @click="del(index, item)">删除</div>
                <div class="modify" @click="modify(index, item)">修改</div>
            </div>
        </div>

        <div class="popover" v-show="showPopover">
            <div class="inner">
                <el-input v-model="name" placeholder="分类名称"></el-input>
                <el-input v-model="priority" type="number" placeholder="优先级"></el-input>
                <div class="soldOut">
                    <el-radio v-model="soldOut" label="0">上架</el-radio>
                    <el-radio v-model="soldOut" label="1">下架</el-radio>
                </div>
                <img :src="icon" alt v-if="icon" />
                <input class="upload" type="file" @change="upload" accept="image/*" />
                <el-button @click="submit">提交</el-button>
                <el-button @click="showPopover = false; reset();">取消</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { post, api, uploadImg } from "../../utils/httpApi";
import { sortByKey } from "../../utils/common";
export default {
    data() {
        return {
            typeList: [],
            operate: 0, //0-添加 1-编辑
            showPopover: false,
            name: null,
            priority: null,
            soldOut: "0",
            icon: null,
            id: null,
        };
    },
    created() {
        this.getGoodsType();
    },
    methods: {
        getGoodsType() {
            this.typeList = [];
            post(api.getGoodsType)
                .then((res) => {
                    let data = res.data;
                    if (data.code == 0) {
                        let _data = data.data;
                        let arr = [];
                        _data.forEach((v) => {
                            let obj = {
                                label: v.title,
                                id: v.id,
                                icon: api.baseUrl + v.icon,
                                priority: v.priority,
                                soldOut: v.soldOut,
                                updatedAt: v.updatedAt,
                            };
                            arr.push(obj);
                        });
                        arr = sortByKey(arr, "id", "Des");
                        this.typeList = arr;
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
        modify(index, item) {
            this.operate = 1;
            this.showPopover = true;
            this.name = item.label;
            this.priority = item.priority;
            this.soldOut = item.soldOut.toString();
            this.icon = item.icon;
            this.id = item.id;
        },
        submit() {
            let params = this.$qs.stringify({
                    title: this.name,
                    priority: parseInt(this.priority),
                    soldOut: parseInt(this.soldOut),
                    icon: this.icon.replace(api.baseUrl, ""),
                    id: this.id,
                }),
                _api = this.operate == 0 ? api.addGoodsType : api.putGoodsType;
            post(_api, params)
                .then((res) => {
                    let data = res.data;
                    if (data.code == 0) {
                        this.showPopover = false;
                        this.reset();
                        this.getGoodsType();
                        this.$Message.success(data.message);
                        return false;
                    }
                    this.$Message.error(data.message);
                })
                .catch((err) => {
                    console.log(err);
                    this.$Message.error(err);
                });
        },
        upload(e) {
            let files = e.target.files[0];
            e.target.value = "";
            uploadImg(api.uploadSinglePicture, files, 3)
                .then((res) => {
                    let data = res.data;
                    if (data.code == 0) {
                        this.icon = api.baseUrl + data.data;
                        return false;
                    }
                    this.$Message.error("图片上传失败");
                })
                .catch((err) => {
                    this.$Message.error(err);
                });
        },
        reset() {
            this.name = null;
            this.priority = null;
            this.soldOut = "0";
            this.icon = null;
        },
    },
};
</script>

<style scoped>
@import "goodsTypeMgt.css";
</style>