import axios from 'axios';
import { getCookie } from "../utils/common"

axios.defaults.withCredentials = true; //让ajax携带cookie
axios.defaults.timeout = 30000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// 请求拦截
axios.interceptors.request.use(config => {
    config.headers.token = getCookie("SHOPSESSIONID");
    // 在发送请求之前做些什么 验证token之类的
    return config;
}, error => {
    return Promise.error(error);
});
// 响应拦截
axios.interceptors.response.use(response => {
    return response;
}, error => {
    return Promise.reject(error);
});

const ENV = process.env.NODE_ENV;
let url;

if (ENV == "development") {
    url = "http://127.0.0.1:8001/api";
}
if (ENV == "production") {
    url = process.env.PROD_API_URL;
}

let user = "/b/user/", goods = "/goods/", upload = "/upload/", spec = "/spec/";
export const api = {
    baseUrl: url,
    //用户
    login: url + user + "login",

    //商品
    getGoodsType: url + goods + "getGoodsType",
    getGoodsList: url + goods + "getGoodsList",
    delGoodsType: url + goods + "delGoodsType",
    addGoodsType: url + goods + "addGoodsType",
    putGoodsType: url + goods + "putGoodsType",

    //规格
    getAttr: url + spec + "getAttr",
    addAttrKey: url + spec + "addAttrKey",
    addAttrValue: url + spec + "addAttrValue",
    delAttrValue: url + spec + "delAttrValue",
    delAttrKey: url + spec + "delAttrKey",

    //上传
    uploadSinglePicture: url + upload + "uploadSinglePicture",
}

export function get(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params,
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

export function post(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, params).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

export function put(url, params) {
    return new Promise((resolve, reject) => {
        axios.put(url, params).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

export function del(url, params) {
    return new Promise((resolve, reject) => {
        axios.delete(url, params).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

export function uploadImg(url, files, type) {
    return new Promise((resolve, reject) => {
        let params = new FormData();
        params.append("file", files);
        params.append("fileType", type);
        post(url, params)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(err);
            });
    })
}