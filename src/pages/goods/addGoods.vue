<template>
    <div class="addGoods">
        <el-form ref="form" :model="form" :rules="rules" label-width="auto">
            <el-form-item label="商品分类" prop="goodsCategoryId">
                <el-select class="goodsCategory"
                           v-model="form.goodsCategoryId" placeholder="请选择商品分类">
                    <el-option
                            v-for="item in goodsCategoryOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商品主标题" prop="mainTitle">
                <el-input v-model="form.mainTitle" placeholder="请输入商品主标题"></el-input>
            </el-form-item>
            <el-form-item label="商品副标题" prop="subTitle">
                <el-input v-model="form.subTitle" placeholder="请输入商品副标题"></el-input>
            </el-form-item>
            <el-form-item label="原价" prop="originalPrice">
                <el-input type="number"
                          placeholder="请输入商品原价"
                          v-model.number="form.originalPrice"
                          autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="优惠价" prop="discountPrice">
                <el-input type="number"
                          placeholder="请输入商品优惠价"
                          v-model.number="form.discountPrice"
                          autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="商品封面">
                <el-upload :action="uploadAction" list-type="picture-card" :auto-upload="false"
                           :on-success="uploadCoverSuccess">
                    <i slot="default" class="el-icon-plus"></i>
                    <div slot="file" slot-scope="{file}">
                        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                        <span class="el-upload-list__item-actions">
                            <span v-if="!form.disabled" class="el-upload-list__item-delete" @click="removeCover(file)">
                                <i class="el-icon-delete"></i>
                            </span>
                        </span>
                    </div>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit('form')">提交</el-button>
                <el-button type="danger" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {api, post} from "../../utils/httpApi";
    import {hexadecimalColors} from "../../utils/common";

    export default {
        name: "addGoods",
        data() {
            return {
                goodsCategoryOptions: [],
                rules: {
                    goodsCategoryId: [
                        {required: true, message: '请选择商品分类', trigger: 'change'}
                    ],
                    mainTitle: [
                        {required: true, message: '请输入商品主标题', trigger: 'blur'}
                    ],
                    subTitle: [
                        {required: true, message: '请输入商品副标题', trigger: 'blur'}
                    ],
                    originalPrice: [
                        {required: true, message: '请输入商品原价', trigger: 'blur'},
                        {type: 'number', message: '商品原价必须为数字值'}
                    ],
                    discountPrice: [
                        {type: 'number', message: '商品优惠价必须为数字值'}
                    ]
                },
                uploadAction: api.uploadSinglePicture,
                form: {
                    goodsCategoryId: null,
                    mainTitle: null,
                    subTitle: null,
                    originalPrice: null,
                    discountPrice: null,
                    disabled: false,
                }
            }
        },
        created() {
            this.getGoodsCategory();
        },
        methods: {
            getGoodsCategory() {
                post(api.getGoodsType).then(res => {
                    let data = res.data;
                    if (data.code == 0) {
                        let arr = [];
                        data.data.forEach(v => {
                            v.label = v.title;
                            v.value = v.id;
                            arr.push(v);
                        })
                        arr.unshift({
                            label: "全部",
                            value: -1
                        })
                        this.goodsCategoryOptions = arr;
                        return false;
                    }
                    this.$Message.error(data.message);
                }).catch(err => {
                    this.$Message.error(err);
                })
            },
            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        alert('submit!');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            reset() {

            },
            removeCover(file) {
                console.log(file);
            },
            uploadCoverSuccess(res, file) {
                console.log(res);
                console.log(file);
            }
        }
    }
</script>

<style scoped>
    @import "addGoods.css";
</style>