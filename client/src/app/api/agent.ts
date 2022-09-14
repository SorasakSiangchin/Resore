/* eslint-disable no-duplicate-case */
import axios, { AxiosError, AxiosResponse } from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { history } from "../..";
// ใช้รว่มกัน
axios.defaults.baseURL = "http://localhost:5000/api/";

 const ResponseBody = (response:AxiosResponse)=>{
    return response.data
};

const sleep = () => new Promise(resolve => setTimeout(resolve,100));

// เป็นการแสกแสง
// ตอนขึ้นProduction ไม่ได้ใช้
axios.interceptors.response.use(async (response) => {
    await sleep();
    // จะ return ไปที่ then
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
    get : (url : string)=> axios.get(url).then(ResponseBody) ,
    
}

const Catalog = {
      list : () => requests.get("Products"),
      details: (id: number) => requests.get(`Products/GetProducts/${id}`), 
}

const TestError = {
    get400Error: () => requests.get('buggy/GetBadRequest'), 
    get401Error: () => requests.get('buggy/GetUnAuthorized'),
    get404Error : ()=>requests.get("Buggy/GetNotFound"),
    get500Error: () => requests.get('buggy/GetServerError'), 
    getValidationError: () => requests.get('buggy/GetValidationError'), 
}

const agent = {
    Catalog ,
    TestError
}

export default agent;