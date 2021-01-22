<template>
    <div class="addGoods">
        <el-form class="form" ref="form" :model="form" :rules="rules" label-width="auto">
            <el-form-item label="商品分类" prop="goodsCategoryId">
                <el-select
                    class="goodsCategory"
                    v-model="form.goodsCategoryId"
                    placeholder="请选择商品分类"
                >
                    <el-option
                        v-for="item in goodsCategoryOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商品主标题" prop="mainTitle">
                <el-input v-model="form.mainTitle" placeholder="请输入商品主标题"></el-input>
            </el-form-item>
            <el-form-item label="商品副标题" prop="subTitle">
                <el-input v-model="form.subTitle" placeholder="请输入商品副标题"></el-input>
            </el-form-item>
            <el-form-item label="原价" prop="originalPrice">
                <el-input
                    type="number"
                    placeholder="请输入商品原价"
                    v-model.number="form.originalPrice"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item label="优惠价" prop="discountPrice">
                <el-input
                    type="number"
                    placeholder="请输入商品优惠价"
                    v-model.number="form.discountPrice"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item label="商品封面" class="cover" prop="cover">
                <div class="item" v-for="(item, index) in form.cover" :key="item">
                    <img :src="item" alt />
                    <div class="mask"></div>
                    <i class="el-icon-delete" @click="removeCover(index)"></i>
                </div>
                <div class="uploadCover item" v-if="form.cover.length != 5" @click="getCoverFile">
                    <i class="el-icon-plus"></i>
                </div>
                <input
                    type="file"
                    ref="uploadCover"
                    v-show="false"
                    @change="uploadCover($event)"
                    accept="image/*"
                />
            </el-form-item>
            <el-form-item label="状态">
                <el-radio-group v-model="form.soldOut">
                    <el-radio label="0" v-model="form.soldOut">上架</el-radio>
                    <el-radio label="1" v-model="form.soldOut">下架</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="库存" prop="stock">
                <el-input
                    type="number"
                    placeholder="请输入商品库存"
                    v-model.number="form.stock"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item label="规格"></el-form-item>
            <el-form-item label="内容">
                <div id="wangeditor"></div>
            </el-form-item>
            <el-form-item class="btn-box">
                <el-button type="primary" @click="submit('form')">提交</el-button>
                <el-button type="danger" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { api, post, uploadImg } from "../../utils/httpApi";
import { hexadecimalColors } from "../../utils/common";
import E from "wangeditor";

export default {
    name: "addGoods",
    components: {},
    data() {
        return {
            goodsCategoryOptions: [],
            rules: {
                goodsCategoryId: [
                    {
                        required: true,
                        message: "请选择商品分类",
                        trigger: "change",
                    },
                ],
                mainTitle: [
                    {
                        required: true,
                        message: "请输入商品主标题",
                        trigger: "blur",
                    },
                ],
                subTitle: [
                    {
                        required: true,
                        message: "请输入商品副标题",
                        trigger: "blur",
                    },
                ],
                originalPrice: [
                    {
                        required: true,
                        message: "请输入商品原价",
                        trigger: "blur",
                    },
                    { type: "number", message: "商品原价必须为数字值" },
                ],
                discountPrice: [
                    { type: "number", message: "商品优惠价必须为数字值" },
                ],
                cover: [
                    {
                        required: true,
                        message: "至少上传一张图片",
                        trigger: "change",
                    },
                ],
                stock: [
                    {
                        required: true,
                        message: "请输入商品库存",
                        trigger: "blur",
                    },
                    { type: "number", message: "商品库存必须为数字值" },
                    {
                        min: 0,
                        message: "长度在 3 到 5 个字符",
                        trigger: "blur",
                    },
                ],
            },
            form: {
                goodsCategoryId: null,
                mainTitle: null,
                subTitle: null,
                originalPrice: null,
                discountPrice: null,
                cover: [],
                soldOut: "0",
                stock: null,
                content: "",
            },
            editor: null,
        };
    },
    created() {
        this.getGoodsCategory();
    },
    methods: {
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
        submit(formName) {
            console.log(this.editor.txt.html());
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    alert("submit!");
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        reset() {},
        getCoverFile() {
            this.$refs.uploadCover.click();
        },
        uploadCover(e) {
            let files = e.target.files[0];
            e.target.value = "";
            uploadImg(api.uploadSinglePicture, files, 2)
                .then((res) => {
                    let data = res.data;
                    if (data.code == 0) {
                        this.form.cover.push(api.baseUrl + data.data);
                        return false;
                    }
                    this.$Message("图片上传失败");
                })
                .catch((err) => {
                    this.$Message(err);
                });
        },
        removeCover(index) {
            this.form.cover.splice(index, 1);
        },
    },
    mounted() {
        const editor = new E("#wangeditor");
        editor.config.placeholder = "请输入商品内容";
        editor.config.uploadImgMaxLength = 1;
        editor.config.customUploadImg = (files, insert) => {
            let file = files[0];
            uploadImg(api.uploadSinglePicture, file, 2)
                .then((res) => {
                    let data = res.data;
                    if (data.code == 0) {
                        insert(api.baseUrl + data.data);
                        return false;
                    }
                    this.$Message("图片上传失败");
                })
                .catch((err) => {
                    this.$Message(err);
                });
        };
        editor.create();
        this.editor = editor;
    },
};
</script>

<style scoped>
@import "goodsDetail.css";
</style>