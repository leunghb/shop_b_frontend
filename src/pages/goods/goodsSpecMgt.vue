<template>
    <div class="goodsSkuMgt">
        <div class="title">商品规格管理</div>
        <el-divider></el-divider>
        <el-select
            class="goodsCategory"
            v-model="currentGoodsCategory"
            placeholder="商品分类"
            @change="filtrate"
        >
            <el-option
                v-for="item in goodsCategoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>
        </el-select>
        <el-button
            @click="
                canAddAttrKey = !canAddAttrKey;
                attrKeyText = '';
            "
            v-text="!canAddAttrKey ? '添加规格组' : '取消添加规格组'"
        ></el-button>
        <el-input
            class="attrKeyInput"
            v-show="canAddAttrKey"
            v-model="attrKeyText"
            placeholder="请输入规格组名称"
        ></el-input>
        <el-button v-show="attrKeyText.length != 0" @click="addAttrKey"
            >添加</el-button
        >

        <el-collapse
            v-model="activeCollapse"
            accordion
            class="collapse"
            v-for="(item, index) in spec"
            :key="item.keyId"
            @change="attrValueText = ''"
        >
            <el-collapse-item>
                <template slot="title">
                    <div
                        class="title"
                        v-text="item.keyName + '（' + item.goodsTypeName + '）'"
                        v-show="currentGoodsCategory == -1"
                        v-cloak
                    ></div>
                    <div
                        class="title"
                        v-text="item.keyName"
                        v-show="currentGoodsCategory != -1"
                        v-cloak
                    ></div>
                </template>
                <el-tag
                    class="value"
                    v-for="(_item, _index) in item.values"
                    closable
                    :key="_item.id"
                    @close="delAttrValue(_item, _index, index)"
                    >{{ _item.name }}</el-tag
                >
                <el-input class="attrKeyInput" v-model="attrValueText">
                    <el-button
                        class="btn"
                        slot="append"
                        @click="addAttrValue(index, item.keyId)"
                        icon="el-icon-plus"
                    ></el-button>
                </el-input>
                <el-button
                    v-if="item.values.length == 0"
                    @click="delAttrKey(item.keyId, index)"
                >
                    删除当前规格组
                </el-button>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
import { uuid } from "../../utils/common";
import { get, api, post } from "../../utils/httpApi";
export default {
    data() {
        return {
            goodsCategoryOptions: [],
            currentGoodsCategory: -1,
            activeCollapse: "1",
            spec: [],
            canAddAttrKey: false,
            attrKeyText: "",
            attrValueText: "",
        };
    },
    created() {
        this.getAttrKey();
        this.getGoodsCategory();
    },
    methods: {
        getAttrKey() {
            this.spec = [];
            let params = this.$qs.stringify({
                goodsTypeId: this.currentGoodsCategory,
            });
            post(api.getAttr, params)
                .then((res) => {
                    let data = res.data;
                    if (data.code == 0) {
                        this.spec = data.data;
                        return false;
                    }
                    this.$Message.error(data.message);
                })
                .catch((err) => {
                    this.$Message.error(err);
                });
        },
        addAttrKey() {
            if (this.currentGoodsCategory == -1) {
                this.$Message.error("请选择具体的商品分类");
                return false;
            }
            let params = this.$qs.stringify({
                goodsTypeId: this.currentGoodsCategory,
                name: this.attrKeyText,
            });
            post(api.addAttrKey, params)
                .then((res) => {
                    let data = res.data;
                    if (data.code == 0) {
                        this.getAttrKey();
                        this.$Message.success(data.message);
                        this.attrKeyText = "";
                        return false;
                    }
                    this.$Message.error(data.message);
                })
                .catch((err) => {
                    this.$Message.error(err);
                });
        },
        delAttrValue(_item, _index, index) {
            let params = this.$qs.stringify({
                id: _item.id,
            });
            post(api.delAttrValue, params)
                .then((res) => {
                    let data = res.data;
                    if (data.code == 0) {
                        this.spec[index].values.splice(_index, 1);
                        this.$Message.success(data.message);
                        return false;
                    }
                    this.$Message.error(data.message);
                })
                .catch((err) => {
                    this.$Message.error(err.message);
                });
        },
        getGoodsCategory() {
            post(api.getGoodsType)
                .then((res) => {
                    let data = res.data;
                    if (data.code == 0) {
                        let arr = [];
                        data.data.forEach((v) => {
                            v.label = v.title;
                            v.value = v.id;
                            arr.push(v);
                        });
                        arr.unshift({
                            label: "全部",
                            value: -1,
                        });
                        this.goodsCategoryOptions = arr;
                        return false;
                    }
                    this.$Message.error(data.message);
                })
                .catch((err) => {
                    this.$Message.error(err);
                });
        },
        filtrate() {
            this.getAttrKey();
        },
        addAttrValue(index, attrKeyId) {
            let params = this.$qs.stringify({
                attrKeyId: attrKeyId,
                name: this.attrValueText,
            });
            post(api.addAttrValue, params)
                .then((res) => {
                    let data = res.data;
                    console.log(data);
                    if (data.code == 0) {
                        this.$Message.success(data.message);
                        let obj = {
                            id: data.data,
                            name: this.attrValueText,
                        };
                        this.spec[index].values.unshift(obj);
                        this.attrValueText = "";
                        return false;
                    }
                    this.$Message.error(data.message);
                })
                .catch((err) => {
                    this.$Message.error(err.message);
                });
        },
        delAttrKey(keyId, index) {
            let params = this.$qs.stringify({
                id: keyId,
            });
            post(api.delAttrKey, params)
                .then((res) => {
                    let data = res.data;
                    if (data.code == 0) {
                        this.$Message.success(data.message);
                        this.spec.splice(index, 1);
                        return false;
                    }
                    this.$Message.error(data.message);
                })
                .catch((err) => {
                    this.$Message.error(err.message);
                });
        },
    },
};
</script>

<style scoped>
@import "goodsSpecMgt.css";
</style>