<template>
    <div class="order">
        <el-select
            class="orderStatusSelect"
            v-model="orderStatus"
            placeholder="请选择订单状态"
            @change="selOrderStatus"
        >
            <el-option
                v-for="item in orderStatusOpt"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
        </el-select>

        <el-table class="list" :data="list" border style="width: 100%">
            <el-table-column fixed label="订单编号" width="120">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p v-text="scope.row.orderId"></p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag
                                size="medium"
                                v-text="scope.row.orderNumber"
                            ></el-tag>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="orderStatusText" label="状态" width="100">
            </el-table-column>
            <el-table-column prop="account" label="账号" width="200">
            </el-table-column>
            <el-table-column label="收货人" width="300">
                <template slot-scope="scope" v-if="scope.row.consignee">
                    <p class="consignee" v-text="scope.row.consignee.name"></p>
                    <p class="consignee" v-text="scope.row.consignee.tel"></p>
                    <p
                        class="consignee"
                        v-text="scope.row.consignee.address"
                    ></p>
                </template>
            </el-table-column>
            <el-table-column prop="totalPrice" label="总金额" width="120">
            </el-table-column>
            <el-table-column label="商品信息" width="90">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <div
                            class="goodsDetail"
                            v-for="item in scope.row.goodsDetail"
                            :key="item.goodsId"
                        >
                            <div>
                                <img :src="item.cover" alt="" />
                            </div>
                            <div
                                v-text="
                                    '名称：' +
                                    item.mainTitle +
                                    '（' +
                                    item.numberOfpurchases +
                                    '件）'
                                "
                            ></div>
                            <div v-text="'规格：' + item.selectedSkuText"></div>
                            <div v-text="'原价：' + item.originalPrice"></div>
                            <div v-text="'优惠价：' + item.discountPrice"></div>
                            <div v-text="'商品编号：' + item.goodsId"></div>
                            <div class="line"></div>
                        </div>
                        <div slot="reference">
                            <el-tag size="medium">查看更多</el-tag>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="payTimeText" label="支付时间" width="160">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button
                        v-show="
                            scope.row.orderStatus == 4 ||
                            scope.row.orderStatus == 5
                        "
                        v-cloak
                        @click="refunds(scope.row)"
                        type="text"
                        size="small"
                        >处理退货退款</el-button
                    >
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            layout="prev, pager, next"
            :total="total"
            @current-change="handleCurrentChange"
        >
        </el-pagination>
    </div>
</template>

<script>
import { formatDate, formatMoney, orderStatusText } from "../../utils/common";
import { post, api } from "../../utils/httpApi";

export default {
    name: "order",
    data() {
        return {
            orderStatusOpt: [
                {
                    label: "全部",
                    value: null,
                },
                {
                    label: "未支付",
                    value: 0,
                },
                {
                    label: "已支付",
                    value: 1,
                },
                {
                    label: "已收货",
                    value: 2,
                },
                {
                    label: "已完成",
                    value: 8,
                },
                {
                    label: "退货/退款中",
                    value: 3,
                },
                {
                    label: "已退货/退款",
                    value: 4,
                },
            ],
            orderStatus: null,
            list: [],
            limit: 6,
            page: 1,
            total: 0,
        };
    },
    created() {
        this.getOrderList();
    },
    methods: {
        getOrderList() {
            let params = this.$qs.stringify({
                orderStatus: this.orderStatus,
                limit: this.limit,
                page: this.page,
            });
            post(api.getOrderList, params)
                .then((res) => {
                    let data = res.data;
                    if (data.code == 0) {
                        let list = data.data.list;
                        this.total = data.data.count;
                        list.forEach((v, k) => {
                            v.orderStatusText = orderStatusText(v.orderStatus);
                            v.orderNumber =
                                v.orderId.substring(0, 5) +
                                "..." +
                                v.orderId.substring(v.orderId.length - 5);
                            this.getAddress(v.account, v.addressId, k);
                            v.price = v.totalPrice;
                            v.totalPrice = "$" + formatMoney(v.totalPrice);
                            let info = JSON.parse(v.info);
                            v.goodsDetail = [];
                            info.forEach((_v, _k) => {
                                this.getGoodsDetail(_v, k);
                            });
                            v.payTimeText =
                                v.orderStatus > 0
                                    ? formatDate(v.payTime)
                                    : "— —";
                            this.list.push(v);
                        });
                    }
                })
                .catch((err) => {
                    this.$Message.success(err.message);
                });
        },
        getAddress(account, addressId, index) {
            let params = this.$qs.stringify({
                id: addressId,
                account: account,
            });
            post(api.getAddressById, params)
                .then((res) => {
                    let data = res.data;
                    if (data.code == 0) {
                        let info = data.data;
                        this.$set(this.list[index], "consignee", {
                            name: info.name,
                            tel: info.tel,
                            address: info.address,
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        getGoodsDetail(item, index) {
            let params = this.$qs.stringify({
                goodsId: item.goodsId,
            });
            post(api.getGoodsDetail, params)
                .then((res) => {
                    let data = res.data;
                    if (data.code == 0) {
                        let info = data.data,
                            goodsDetail = this.list[index].goodsDetail;
                        let cover = info.goodsInfo.cover,
                            symbolIndex = cover.indexOf(",");
                        cover =
                            symbolIndex != -1
                                ? cover.substring(0, symbolIndex)
                                : cover;
                        goodsDetail.push({
                            goodsId: info.goodsInfo.goodsId,
                            numberOfpurchases: item.numberOfpurchases,
                            selectedSkuText: item.selectedSkuText,
                            cover: api.baseUrl + cover,
                            originalPrice:
                                "￥" +
                                formatMoney(info.goodsInfo.originalPrice),
                            discountPrice:
                                "￥" +
                                formatMoney(info.goodsInfo.discountPrice),
                            mainTitle: info.goodsInfo.mainTitle,
                        });
                        this.$set(this.list[index], "goodsDetail", goodsDetail);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        selOrderStatus(val) {
            this.list = [];
            this.page = 1;
            this.getOrderList();
        },
        handleCurrentChange(val) {
            this.page = val;
            this.list = [];
            this.getOrderList();
        },
        refunds(row) {
            let orderStatus = row.orderStatus;
            let tips = "",
                _api,
                successText = "";
            switch (orderStatus) {
                case 4:
                    _api = api.completeRefund;
                    tips = "该订单将完成退款";
                    successText = "已退款完成";
                    break;
                case 5:
                    _api = api.completeReturnRefund;
                    tips = "该订单将完成退货退款";
                    successText = "已退货退款完成";
                    break;
            }
            this.$MessageBox
                .confirm(tips, "", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                .then(() => {
                    let params = this.$qs.stringify({
                        orderId: row.orderId,
                        account: row.account,
                        useAmount: row.price,
                    });
                    post(_api, params)
                        .then((res) => {
                            let data = res.data;
                            if (data.code == 0) {
                                this.$Message.success(successText);
                                this.list = [];
                                this.page = 1;
                                this.getOrderList();
                                return false;
                            }
                            this.$Message.error(data.message);
                        })
                        .catch((err) => {
                            this.$Message.error(err.message);
                        });
                })
                .catch(() => {});
        },
    },
};
</script>

<style scoped>
@import "./order.css";
</style>