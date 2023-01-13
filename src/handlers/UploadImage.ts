function UploadImgCandidate(results:any){
    return JSON.stringify({code: "200",
        message: "File uploaded successfully.",
        data: null,path:results});
}

const UploadImage = {
    UploadImgCandidate
}
export {UploadImage}