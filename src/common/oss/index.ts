import {httpGet, httpPost, httpPostForm} from "../axios";
import OSS from "ali-oss";
import {getUserInfo} from "../user";

export interface OssToken {
    accessKeyId: string;
    accessKeySecret: string;
    securityToken: string;
    endpoint: string;
}

export const getOssToken = async (filename: string) => {
    return httpGet<OssToken>("/common/get-ali-upload-sts", {
        params: {
            hash: filename
        }
    });
}

export const uploadFileToOss = async (file: File, onProgress: (progress: number) => void) => {
    const user = await getUserInfo();
    if (!user) {
        throw new Error("用户未登录");
    }

    const path = 'tmp/user' + user.userId + '/';
    let fileName = `${Date.now()}-${file.name}`;

    const ossTokenRes = await getOssToken(fileName);
    fileName = path + fileName;

    if (ossTokenRes.code !== 200) {
        throw new Error(ossTokenRes.msg);
    }

    const ossToken = ossTokenRes.data!;

    const client = new OSS({
        accessKeyId: ossToken.accessKeyId,
        accessKeySecret: ossToken.accessKeySecret,
        stsToken: ossToken.securityToken,
        secure: true,
        endpoint: ossToken.endpoint,
        bucket: "moeee",
    });

    await client.multipartUpload(fileName, file, {
        progress: (percentage: number) => {
            onProgress(percentage * 100);
        },
    });

    return fileName;
}

export const uploadImg = async (file: File) => {
    const data = new FormData();
    data.append("file", file);
    return httpPostForm("https://abdecd.xyz/moe/common/upload-image", data).then(res => {
        if (res.code === 200) {
            return res.data;
        } else {
            throw new Error(res.msg);
        }
    });
}
