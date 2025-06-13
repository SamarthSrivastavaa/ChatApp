import axios from "axios";

export const axiosInstance=axios.create({
    baseURL:"http://localhost:5001/api",
    withCredentials:true  //since well be passing cookies with every request
})


//now we can use this axios instance anywhere and do..axiosInstance.get/axiosInstance.put/axiosInstance.post/axiosInstance.delete

//REVISE FRONTEND
// LEARN MORE BOUT ZUSTAND