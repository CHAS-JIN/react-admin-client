import React, { Component } from 'react'
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types'
import { BASE_IMG_URL } from '../../utils/constant';

export default class PicturesWall extends Component {

    // 约束参数类型
    static propTypes = {
        imgs: PropTypes.array
    }

    // 构造函数初始化state
    constructor(props) {
        super(props)

        let fileList = []

        // 如果传入了imgs属性
        const { imgs } = this.props
        if (imgs && imgs.length > 0) {
            fileList = imgs.map((img, index) => ({
                uid: -index, // 唯一的id，建议为负数，避免与内部标识冲突
                name: img, // 图片文件名
                status: 'done', // 图片状态: done-已上传, uploading: 正在上传中, removed: 已删除
                url: BASE_IMG_URL + img
            }))
        }

        this.state = {
            previewVisible: false,  // 是否显示大图预览Modal
            previewImage: '',       // 大图的URL
            previewTitle: '',       // 大图的标题
            fileList,
        }
    }



    getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    // 隐藏Modal
    handleCancel = () => this.setState({ previewVisible: false })

    // 显示指定图片的大图
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await this.getBase64(file.originFileObj);
        }
        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    }

    /* 
        +++  主要操作  +++ 
        file: 当前操作的图片文件（上传、删除）
        fileLiest: 所有已上传图片文件对象的数组
    */
    handleChange = async ({ file, fileList }) => {
        // console.log(fileList);
        // 一旦上传成功，将当前上传的file的信息修正（name,url）
        if (file.status === 'done') {
            const result = file.response
            if (result.status === 0) {
                message.success('上传图片成功！')
                const { name, url } = result.data
                // 指向同一个对象
                file = fileList[fileList.length - 1]
                // 修改信息
                file.name = name
                file.url = url
            } else {
                message.error('上传图片失败！')
            }
        }

        // 在操作过程中更新fileList
        this.setState({ fileList })
    }

    getImgs() {
        // 返回每个图片的name
        return this.state.fileList.map(file => file.name)
    }

    render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        return (
            <>
                <Upload
                    action="/manage/img/upload"
                    // 请求参数名
                    name='image'
                    // 只接受图片类型
                    accept='image/*'
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}

                >
                    {/* 不能上传超过3张图片 */}
                    {fileList.length >= 3 ? null : uploadButton}
                </Upload>
                <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </>
        );
    }
}