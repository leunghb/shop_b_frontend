<template>
    <div class="goods">
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
        <el-select
            class="goodsStatus"
            v-model="soldOut"
            placeholder="商品状态"
            @change="filtrate"
        >
            <el-option
                v-for="item in goodsStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>
        </el-select>
        <el-input
            class="search"
            placeholder="请输入商品名称"
            v-model="searchText"
        >
            <el-button
                slot="append"
                icon="el-icon-search"
                @click="search"
            ></el-button>
        </el-input>
        <el-button @click="addGoods">添加商品</el-button>

        <el-table class="goodsTable" :data="goodsList" style="width: 100%">
            <el-table-column label="上架日期" width="200">
                <template slot-scope="scope">
                    <i class="el-icon-sell"></i>
                    <span style="margin-left: 10px">
                        {{ scope.row.addedTime }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="商品名称" width="180">
                <template slot-scope="scope">
                    <span class="beyondOmission">
                        {{ scope.row.mainTitle }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="商品封面" width="180">
                <template slot-scope="scope">
                    <img width="50" height="50" :src="scope.row.cover" alt />
                </template>
            </el-table-column>
            <el-table-column label="商品原价" width="180">
                <template slot-scope="scope">
                    <span>￥{{ scope.row.originalPrice }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="tag" label="类型" width="100">
                <template slot-scope="scope">
                    <el-tag
                        effect="plain"
                        :style="{ color: goodsTagStyle(scope.row.goodsTypeId) }"
                        >{{ scope.row.tag }}</el-tag
                    >
                </template>
            </el-table-column>
            <el-table-column label="最近修改日期" width="200">
                <template slot-scope="scope">
                    <i class="el-icon-edit"></i>
                    <span style="margin-left: 10px">
                        {{ scope.row.modificationTime }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label width="auto"></el-table-column>
            <el-table-column label="操作" fixed="right" width="150">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        @click="goodsEdit(scope.$index, scope.row)"
                        >编辑</el-button
                    >
                    <el-button
                        size="mini"
                        type="danger"
                        @click="goodsDel(scope.$index, scope.row)"
                        >删除</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            class="pagination"
            background
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-size="limit"
            layout="total, prev, pager, next, jumper"
            :total="total"
        ></el-pagination>

        <el-button @click="addGoodsType">商品分类管理</el-button>
        <el-button @click="addSku">商品规格管理</el-button>
    </div>
</template>

<script>
import { api, post } from "../../utils/httpApi";
import {
    formatDate,
    formatMoney,
    hexadecimalColors,
    padNumber,
} from "../../utils/common";

export default {
    name: "goods",
    data() {
        return {
            goodsCategoryOptions: [],
            currentGoodsCategory: null,
            goodsStatus: [
                {
                    label: "全部",
                    value: -1,
                },
                {
                    label: "已上架",
                    value: 0,
                },
                {
                    label: "已下架",
                    value: 1,
                },
            ],
            soldOut: null, //状态 0-上架 1-已下架 -1-全部 defaultValue = "-1",
            searchText: null,

            goodsList: [],
            total: 0,
            limit: 6,
            page: 1,
            tagColors: [],
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
                            this.tagColors.push(hexadecimalColors());
                        });
                        arr.unshift({
                            label: "全部",
                            value: -1,
                        });
                        this.goodsCategoryOptions = arr;
                        this.getGoodsList();
                        return false;
                    }
                    this.$Message.error(data.message);
                })
                .catch((err) => {
                    this.$Message.error(err);
                });
        },
        goodsEdit(index, row) {
            this.$router.push({
                path: "/putGoods",
                query: {
                    goodsId: row.goodsId,
                },
            });
        },
        goodsDel(index, row) {
            let params = this.$qs.stringify({
                goodsId: row.goodsId,
            });
            post(api.delGoods, params)
                .then((res) => {
                    let data = res.data;
                    if (data.code == 0) {
                        this.$Message.success(data.message);
                        this.goodsList.splice(index, 1);
                        return false;
                    }
                    this.$Message.error(data.message);
                })
                .catch((err) => {
                    this.$Message.error(err.message);
                });
        },
        getGoodsList() {
            this.goodsList = [];
            let params = this.$qs.stringify({
                soldOut: this.soldOut,
                goodsTypeId: this.currentGoodsCategory,
                mainTitle: this.searchText,
                page: this.page,
                limit: this.limit,
            });
            post(api.getGoodsList, params)
                .then((res) => {
                    let data = res.data;
                    if (data.code == 0) {
                        this.total = data.data.count;
                        data.data.list.forEach((v) => {
                            v.addedTime = formatDate(v.createdAt);
                            v.modificationTime = formatDate(v.updatedAt);
                            v.cover = api.baseUrl + v.cover.split(",")[0];
                            v.tag = this.goodsTag(v.goodsTypeId);
                            v.originalPrice = formatMoney(v.originalPrice);
                        });
                        this.goodsList = data.data.list;
                        return false;
                    }
                    this.$Message.error(data.message);
                })
                .catch((err) => {
                    this.$Message.error(err);
                });
        },
        goodsTag(goodsTypeId) {
            let arr = this.goodsCategoryOptions;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].id == goodsTypeId) {
                    return arr[i].label;
                }
            }
        },
        goodsTagStyle(goodsTypeId) {
            return this.tagColors[goodsTypeId];
        },
        search() {
            if (this.searchText == null || this.searchText.length == 0)
                return false;
            this.page = 1;
            this.getGoodsList();
        },
        filtrate() {
            this.page = 1;
            this.getGoodsList();
        },
        handleCurrentChange(val) {
            this.page = val;
            this.getGoodsList();
        },
        addGoods() {
            this.$router.push({
                path: "/AddGoods",
            });
        },
        addGoodsType() {
            this.$router.push({
                path: "/GoodsTypeMgt",
            });
        },
        addSku() {
            this.$router.push({
                path: "/GoodsSpecMgt",
            });
        },
    },
};
</script>

<style scoped>
@import "goods.css";
</style>