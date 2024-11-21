import axios from 'axios';
import { Message } from 'iview';
import router from '../router/index';
import store from '../store'


function CreateAxios(url = '/console', time = 50000) {
    const instance = axios.create();
    instance.defaults.baseURL = '';
    instance.defaults.timeout = time;   // 超时时间

    // request拦截器
    instance.interceptors.request.use(config => {
        const token = store.getters['auth/token'];
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    }, error => {
        console.log(error, "woo"); // for debug
        Message.info(error);
        Promise.reject(error);
    });

    // respone拦截器
    instance.interceptors.response.use(function (response) {
        const code = response.data.code;
        if (code === 400001005) {
            store.dispatch('auth/unsetToken')
            router.push({ path: "/login" })
        }
        if (code !== 0 && code !== 200 && code !== 407000015) {
            Message.error(response.data.message);
        }
        return response;
    },

        error => {
            console.log('err' + error);// for debug
            Message.error(error);
            return Promise.reject(error);
        }
    );



    return instance
}


export default CreateAxios
