import React, { Component } from 'react'
import { List, Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import './index.less'
import { BASE_IMG_URL } from '../../utils/constant';
import { reqCategoryName } from '../../api/index';

const { Item } = List

export default class Detail extends Component {

    state = {
        pCategoryName: '',
        categoryName: ''
    }

    async componentDidMount() {
        const { pCategoryId, categoryId } = this.props.location.state
        if (pCategoryId === '0') {
            const pCategoryName = await reqCategoryName(categoryId)
            this.setState({
                pCategoryName: pCategoryName.data.name,
            })
        } else {
            // const pCategoryName = await reqCategoryName(pCategoryId)
            // const categoryName = await reqCategoryName(categoryId)
            const results = await Promise.all([reqCategoryName(pCategoryId),reqCategoryName(categoryId)])
            this.setState({
                pCategoryName: results[0].data.name,
                categoryName: results[1].data.name
            })
        }
    }

    render() {
        const { name, desc, price, detail, imgs } = this.props.location.state
        const { pCategoryName, categoryName } = this.state
        const header = (
            <span>
                <Button type='link' onClick={() => this.props.history.goBack()} icon={<ArrowLeftOutlined style={{ fontSize: 18 }} />} />
                <span style={{ fontSize: 18 }}>商品详情</span>
            </span>
        )

        return (
            <div>
                <List
                    style={{ marginLeft: '20px' }}
                    itemLayout="vertical"
                    header={header}
                    className='product-list'
                >
                    <Item>
                        <span className='product-item-title'>商品名称：</span>
                        <span >{name}</span>
                    </Item>
                    <Item>
                        <span className='product-item-title'>商品描述：</span>
                        <span >{desc}</span>
                    </Item>
                    <Item>
                        <span className='product-item-title'>商品价格：</span>
                        <span >{price}</span>
                    </Item>
                    <Item>
                        <span className='product-item-title'>所属分类：</span>
                        <span >{pCategoryName}{categoryName? '→' + categoryName : ''}</span>
                    </Item>
                    <Item>
                        <span className='product-item-title'>商品图片：</span>
                        <span >
                            {
                                imgs.map(img => (
                                    <img
                                        key={img}
                                        src={BASE_IMG_URL + img}
                                        className='product-item-img'
                                        alt="img"
                                    />
                                ))
                            }
                        </span>
                    </Item>
                    <Item style={{ display: 'flex', justifyContent: 'left' }}>
                        <span className='product-item-title'>商品详情：</span>
                        <span dangerouslySetInnerHTML={{ __html: detail }} />
                    </Item>
                </List>
            </div>
        )
    }
}
