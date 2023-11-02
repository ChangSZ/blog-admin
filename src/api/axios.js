import { clearCookie, getCookie } from '@/libs/cookie';
import axios from 'axios';
import { Message } from 'iview';
import router from '../router/index';


function CreateAxios(url = '/console', time = 10000) {
    const instance = axios.create();
    instance.defaults.baseURL = '';
    instance.defaults.timeout = time;   // 超时时间

    // request拦截器
    instance.interceptors.request.use(config => {
        // if (!config.params.limit) {
        //     console.log(config.params.limit,config.url);
        //     config.params['limit'] = 10;
        // }

        if (getCookie('token')) {
            config.headers['x-auth-token'] = getCookie('token');
        }

        return config;
    }, error => {
        console.log(error, "woo"); // for debug
        Message.info(error);
        Promise.reject(error);
    });

    // respone拦截器
    instance.interceptors.response.use(function (response) {
        // console.log('请求后',this.$route.params);

        // console.log(response.data);
        const code = response.data.code;
        if (code === 400001005) {
            clearCookie('token');
            // location.href = '/login'
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
