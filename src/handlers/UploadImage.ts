function apiResponse(results:any){
    return JSON.stringify({code: "200",
        message: "File uploaded",
        data: null});
}

const UploadImage = {
    apiResponse
}
export {UploadImage}