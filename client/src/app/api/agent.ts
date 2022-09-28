/* eslint-disable no-duplicate-case */
import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../..";
import { PaginatedResponse } from "../models/pagination";


// ใช้รว่มกัน
axios.defaults.baseURL = "http://localhost:5000/api/";

//ให้เครดิตความน่าเชื่อถือ ขออนุญาติเข้าถึง cookies
axios.defaults.withCredentials = true; 

 const ResponseBody = (response:AxiosResponse)=>{
    return response.data
};

const sleep = () => new Promise(resolve => setTimeout(resolve,100));

// เป็นการแสกแสง
// ตอนขึ้น Production ไม่ได้ใช้
axios.interceptors.response.use(async (response) => {
    await sleep();
    // จะ return ไปที่ then
    const pagination = response.headers['pagination']; //ส่งมาจาก ProductController
    if (pagination) {
        response.data = new PaginatedResponse(response.data, JSON.parse(pagination));
        return response;
    }

    return response
} , async (error:AxiosError)=>{
    var data = await error.response?.data; //obj ที่ไม่รู้ชนิด
    var json = JSON.stringify(data); // นำมาเป็น json
    var result = JSON.parse(json); // นำมาเป็น obj
    //console.log(result.status);
    //return 
    switch (result.status) {
        case 400:
            if (result.errors) { 
                const modelStateErrors: string[] = []; 
                for (const key in result.errors) { 
                    if (result.errors[key]) { 
                        modelStateErrors.push(result.errors[key]) ;
                    } 
                } 
                throw modelStateErrors.flat(); 
            } 
            toast.error(result.title);
            // console.log(result);
            break;
        case 401:
            toast.error(result.title);
            break;
        case 404:
            toast.error(result.title);
            break;
        case 500: 
            history.push('/server-error', { state: data }) ;
            toast.error(result.title); 
            break; 
        default:
            break;
    };
});

const requests = {
    get: (url: string, params?: URLSearchParams) => axios.get(url, {params}).then(ResponseBody),
    // body? ส่งก็ได้ไม่ส่งก็ได้
    post : (url : string , body = {})=> axios.post(url , body).then(ResponseBody) ,
    delete : (url : string)=> axios.delete(url).then(ResponseBody) ,
    
};

const Catalog = {
    list: (params: URLSearchParams) => requests.get('Products', params),
    details: (id: number) => requests.get(`Products/GetProducts/${id}`), 
    fetchFilters: () => requests.get('Products/filters'),
};

const TestError = {
    get400Error: () => requests.get('buggy/GetBadRequest'), 
    get401Error: () => requests.get('buggy/GetUnAuthorized'),
    get404Error : ()=>requests.get("buggy/GetNotFound"),
    get500Error: () => requests.get('buggy/GetServerError'), 
    getValidationError: () => requests.get('buggy/GetValidationError'), 
};

const Basket = {
    get : () => requests.get("Basket/GetBasket"),
    addItem : (productId : number , quantity = 1) => requests.post(`basket?productId=${productId}&quantity=${quantity}`),
    removeItem : (productId : number , quantity = 1) => requests.delete(`basket?productId=${productId}&quantity=${quantity}`),
};

const agent = {
    Catalog ,
    TestError ,
    Basket
};

export default agent;