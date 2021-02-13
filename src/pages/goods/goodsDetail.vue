<template>
    <div class="addGoods">
        <el-form
            class="form"
            ref="form"
            :model="form"
            :rules="rules"
            label-width="auto"
        >
            <el-form-item label="商品分类" prop="goodsCategoryId">
                <el-select
                    class="goodsCategory"
                    v-model="form.goodsCategoryId"
                    placeholder="请选择商品分类"
                    @change="selGoodsCategory"
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
                <el-input
                    v-model="form.mainTitle"
                    placeholder="请输入商品主标题"
                ></el-input>
            </el-form-item>
            <el-form-item label="商品副标题" prop="subTitle">
                <el-input
                    v-model="form.subTitle"
                    placeholder="请输入商品副标题"
                ></el-input>
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
                <div
                    class="item"
                    v-for="(item, index) in form.cover"
                    :key="item"
                >
                    <img :src="item" alt />
                    <div class="mask"></div>
                    <i class="el-icon-delete" @click="removeCover(index)"></i>
                </div>
                <div
                    class="uploadCover item"
                    v-if="form.cover.length != 5"
                    @click="getCoverFile"
                >
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
            <el-form-item label="规格">
                <div class="attr" v-show="attrOpt.length > 0">
                    <el-select
                        v-model="attr[index].checked"
                        v-for="(item, index) in attrOpt"
                        :key="item.keyId"
                        :placeholder="'请选择' + item.keyName"
                    >
                        <el-option
                            v-for="_item in item.values"
                            :key="_item.id"
                            :value="_item.id"
                            :label="_item.name"
                        ></el-option>
                    </el-select>
                    <el-button @click="addAttr">添加</el-button>
                    <div class="attrList">
                        <div
                            class="item"
                            v-for="(item, index) in attrChecked"
                            :key="item.spec"
                        >
                            <div class="name" v-text="item.name"></div>
                            <el-input
                                v-model="item.stock"
                                type="number"
                                placeholder="库存"
                                size="mini"
                                onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                            ></el-input>
                            <el-input
                                v-model="item.price"
                                type="number"
                                placeholder="价格"
                                size="mini"
                                onkeyup="this.value= this.value.match(/\d+(\.\d{0,2})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : ''"
                            ></el-input>
                            <i
                                class="el-icon-delete del"
                                @click="delAttrChecked(index)"
                            ></i>
                        </div>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="总库存" prop="stock">
                <el-input
                    type="number"
                    placeholder="请输入商品库存"
                    v-model.number="form.stock"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item label="内容">
                <div id="wangeditor"></div>
            </el-form-item>
            <el-form-item class="btn-box">
                <el-button type="primary" @click="submit('form')"
                    >提交</el-button
                >
                <el-button type="danger" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { api, post, uploadImg } from "../../utils/httpApi";
import E from "wangeditor";
import { uuid } from "../../utils/common";

export default {
    name: "addGoods",
    components: {},
    data() {
        return {
            goodsId: null,
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
            attr: [],
            attrOpt: [],
            attrImgOpt: [],
            attrImgOptIndex: null,
            attrImg: [],
            attrImgActiveIndex: null,
            interimAttrChecked: [],
            attrChecked: [],
            editor: null,
            goodsSpecs: [],
        };
    },
    created() {
        this.goodsId = uuid();
        this.getGoodsCategory();
        this.getGoods();
    },
    methods: {
        getGoods() {
            let params = this.$qs.stringify({
                goodsId: this.$route.query.goodsId,
            });
            post(api.getGoodsDetail, params)
                .then((res) => {
                    let data = res.data;
                    if (data.code == 0) {
                        this.goodsSpecs = data.data.goodsSpecs;
                        let goodsInfo = data.data.goodsInfo;
                        this.form.goodsCategoryId = goodsInfo.goodsTypeId;
                        this.getAttr();
                        this.form.mainTitle = goodsInfo.mainTitle;
                        this.form.subTitle = goodsInfo.subTitle;
                        this.form.originalPrice = goodsInfo.originalPrice;
                        this.form.discountPrice = goodsInfo.discountPrice;
                        this.form.stock = goodsInfo.stock;
                        this.editor.txt.html(
                            goodsInfo.content.replace(
                                "/static/",
                                api.baseUrl + "/static/"
                            )
                        );
                        let cover = goodsInfo.cover.split(",");
                        cover.forEach((v) => {
                            this.form.cover.push(api.baseUrl + v);
                        });
                        this.form.soldOut = String(goodsInfo.soldOut);
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
            let specList = "",
                goodsSpecs = [];
            this.attr.forEach((v, k) => {
                let obj = {},
                    key = v.keyName + "," + v.keyId,
                    value = [];
                v.values.forEach((_v) => {
                    value.push(_v.name + "," + _v.id);
                });
                obj[key] = value;
                let str = JSON.stringify(obj),
                    reg = new RegExp(/{|}/g);
                str = str.replace(reg, "");
                specList += str + (k < this.attr.length - 1 ? "," : "");
            });
            specList = "{" + specList + "}";
            let stock = 0;
            this.attrChecked.forEach((v) => {
                v.price = Number(v.price);
                v.stock = Number(v.stock);
                stock += v.stock ? parseInt(v.stock) : 0;
            });
            if (this.form.stock < stock) {
                this.$Message.error("总库存不得小于" + stock);
                return false;
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let cover = this.form.cover;
                    let _cover = [];
                    cover.forEach((v) => {
                        _cover.push(v.replace(api.baseUrl, ""));
                    });
                    let attr = JSON.stringify(this.attrChecked),
                        reg = new RegExp(/\[|]/g);
                    // attr = attr.replace(reg, "");
                    let params = this.$qs.stringify({
                        goodsId: this.goodsId,
                        goodsTypeId: this.form.goodsCategoryId,
                        originalPrice: this.form.originalPrice,
                        discountPrice: this.form.discountPrice,
                        cover: _cover.join(","),
                        mainTitle: this.form.mainTitle,
                        subTitle: this.form.subTitle,
                        soldOut: Number(this.form.soldOut),
                        stock: Number(this.form.stock),
                        content: this.editor.txt
                            .html()
                            .replace(api.baseUrl, ""),
                        specList: specList,
                        attr: attr,
                    });
                    post(api.addGoods, params)
                        .then((res) => {
                            let data = res.data;
                            if (data.code == 0) {
                                this.$Message.success("添加成功");
                                location.reload();
                                return false;
                            }
                            this.$Message.error(data.message);
                        })
                        .catch((err) => {
                            this.$Message.error(err.message);
                        });
                } else {
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
        selGoodsCategory() {
            this.getAttr();
        },
        getAttr() {
            let params = this.$qs.stringify({
                goodsTypeId: this.form.goodsCategoryId,
            });
            post(api.getAttr, params)
                .then((res) => {
                    let data = res.data;
                    if (data.code == 0) {
                        this.attr = data.data;
                        this.attrImgOpt = data.data;
                        this.attrOpt = data.data;
                        if (this.goodsSpecs.length > 0) {
                            this.goodsSpecs.forEach((v) => {
                                let attrIds = [];
                                v.specs.split(",").forEach((_v) => {
                                    attrIds.push(_v.split("-"));
                                });
                                let str = "";
                                attrIds.forEach((v) => {
                                    for (
                                        let i = 0;
                                        i < this.attrOpt.length;
                                        i++
                                    ) {
                                        if (v[0] == this.attrOpt[i].keyId) {
                                            for (
                                                let j = 0;
                                                j <
                                                this.attrOpt[i].values.length;
                                                j++
                                            ) {
                                                if (
                                                    v[1] ==
                                                    this.attrOpt[i].values[j].id
                                                ) {
                                                    str +=
                                                        this.attrOpt[i].values[
                                                            j
                                                        ].name + ",";
                                                    break;
                                                }
                                            }
                                            break;
                                        }
                                    }
                                });
                                str = str.substring(0, str.length - 1);
                                this.attrChecked.push({
                                    name: str,
                                    id: v.specs,
                                    stock: v.stock,
                                    price: v.price,
                                });
                            });
                        }
                        return false;
                    }
                    this.$Message.error(data.message);
                })
                .catch((err) => {
                    this.$Message.error(data.message);
                });
        },
        getAttrImg(index) {
            this.attrImgActiveIndex = index;
            this.$refs.uploadAttrImg.click();
        },
        uploadAttrImg(e) {
            let files = e.target.files[0];
            e.target.value = "";
            uploadImg(api.uploadSinglePicture, files, 2)
                .then((res) => {
                    let data = res.data;
                    if (data.code == 0) {
                        this.$set(
                            this.attrImg[this.attrImgActiveIndex],
                            "img",
                            api.baseUrl + data.data
                        );
                        return false;
                    }
                    this.$Message("图片上传失败");
                })
                .catch((err) => {
                    this.$Message(err);
                });
        },
        resetAttrImg(index) {
            this.$set(this.attrImg[index], "img", null);
        },
        addAttr() {
            let arr = [];
            let canAdd = true;
            this.attrOpt.forEach((v) => {
                if (v.checked == undefined) canAdd = false;
                v.values.forEach((_v) => {
                    if (v.checked == _v.id) {
                        arr.push(_v);
                    }
                });
            });
            if (!canAdd) {
                this.$Message.error("请选择规格");
                return false;
            }
            let name = "",
                spec = "";
            arr.forEach((v) => {
                name += v.name + ",";
                spec += v.attrKeyId + "-" + v.id + ",";
            });
            name = name.substring(0, name.length - 1);
            spec = spec.substring(0, spec.length - 1);
            let obj = {
                name: name,
                id: spec,
            };
            for (let i = 0; i < this.attrChecked.length; i++) {
                if (this.attrChecked[i].id == obj.id) {
                    this.$Message.error("已存在");
                    return false;
                }
            }
            this.attrChecked.push(obj);
            this.attrOpt.forEach((v) => {
                v.checked = undefined;
            });
        },
        delAttrChecked(index) {
            this.attrChecked.splice(index, 1);
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
    watch: {
        attrImgOptIndex(index) {
            this.attrImg.forEach((v) => {
                this.$set(v, "img", null);
            });
            this.attrImg = this.attrImgOpt[index].values;
        },
    },
};
</script>

<style scoped>
@import "goodsDetail.css";
</style>