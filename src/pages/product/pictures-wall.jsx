/**
 * Created by LuoQuan on 2019/7/10.
 */

import React from 'react';
import {Upload, Icon, Modal,message} from 'antd';

import {reqDeleteImg} from '../../api';

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

/*
 用于图片上传的组件
 */
export default class PicturesWall extends React.Component {
    state = {
        previewVisible: false,  //标识是否显示大图预览modal
        previewImage: '',       //大图的url
        fileList: [],
    };

    /*
     获取所有已上传文件名的数组
     */
    getImgs = () => {
        return this.state.fileList.map((file) => file.url);
    }

    handleCancel = () => this.setState({previewVisible: false});

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    handleChange = async ({file, fileList}) => {
        //上传成功后需要修正file的信息
        if ('done' === file.status) {
            const result = file.response;
            if (200 === result.status) {
                const {url, fileName} = result.list[0];
                const len = fileList.length;
                fileList[len - 1].url = url;
                fileList[len - 1].name = fileName;
            }
        } else if ('removed' === file.status) {
            //删除服务器上的图片
            const result = await reqDeleteImg(file.url);
            console.log(result);
            if (200 === result.status) {
                message.success('图片删除成功');
            }else{
                message.error('删除图片失败');
            }
        }
        this.setState({fileList});
    }

    render() {
        const {previewVisible, previewImage, fileList} = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div>Upload</div>
            </div>
        );
        return (
            <div>
                <Upload
                    // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    accept="image/*"
                    name="image"
                    action="/manage/image/upload"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 3 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>
            </div>
        );
    }
}