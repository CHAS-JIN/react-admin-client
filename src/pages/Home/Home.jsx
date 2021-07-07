import React, { Component } from 'react';

import './index.less'
import { Statistic, Card, Row, Col, DatePicker, Timeline } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined, QuestionCircleOutlined, RedoOutlined } from '@ant-design/icons'
import Line from '../Charts/Line';
import Bar from '../Charts/Bar';
import moment from 'moment'


const dateFormat = 'YYYY/MM/DD'
const { RangePicker } = DatePicker
class Home extends Component {

    state = {
        isVisited: true
    }

    handleChange = (isVisited) => {
        return () => this.setState({ isVisited })
    }

    render() {
        const { isVisited } = this.state

        return (
            <div style={{
                padding: '30px',
                position: 'relative'
            }}>
                <Row gutter='20' style={{ marginBottom: '20px' }}>
                    <Col span='7'>
                        <Card
                            title='商品总量'
                            extra={<QuestionCircleOutlined />}
                            style={{ height: '100%' }}
                        >
                            <Statistic
                                value={1128163}
                                suffix="个"
                                valueStyle={{ fontSize: 35, fontWeight: 'bolder' }}
                            />
                            <Statistic
                                value={15}
                                valueStyle={{ fontSize: 28, color: 'red', marginTop: '20px', marginBottom: '20px' }}
                                prefix={<span><ArrowUpOutlined />周同比</span>}
                                suffix={<div>%</div>}
                            />
                            <Statistic
                                value={10}
                                valueStyle={{ fontSize: 20, color: 'green' }}
                                prefix={<span><ArrowDownOutlined />日同比</span>}
                                suffix={<div>%</div>}
                            />
                        </Card>
                    </Col>

                    <Col span='17'>
                        <Line />
                    </Col>
                </Row>
                <Row>
                    <Card
                        className="home-content"
                        title={<div className="home-menu">
                            <span className={isVisited ? "home-menu-active home-menu-visited" : 'home-menu-visited'}
                                onClick={this.handleChange(true)}>访问量</span>
                            <span className={isVisited ? "" : 'home-menu-active'} onClick={this.handleChange(false)}>销售量</span>
                        </div>}
                        extra={<RangePicker
                            defaultValue={[moment('2019/01/01', dateFormat), moment('2019/06/01', dateFormat)]}
                            format={dateFormat}
                        />}
                    >
                        <Row gutter='20'>
                            <Col span='17'>
                                <Card
                                    className="home-table-left"
                                    title={isVisited ? '访问趋势' : '销售趋势'}
                                    bodyStyle={{ padding: 0, height: 275 }}
                                    extra={<RedoOutlined />}
                                >
                                    <Bar />
                                </Card>
                            </Col>
                            <Col span='7'>
                                <Card title='任务' extra={<RedoOutlined />} className="home-table-right">
                                    <Timeline>
                                        <Timeline.Item color="green">新版本迭代会</Timeline.Item>
                                        <Timeline.Item color="green">完成网站设计初版</Timeline.Item>
                                        <Timeline.Item color="red">
                                            <p>联调接口</p>
                                            <p>功能验收</p>
                                        </Timeline.Item>
                                        <Timeline.Item>
                                            <p>登录功能设计</p>
                                            <p>权限验证</p>
                                            <p>页面排版</p>
                                        </Timeline.Item>
                                    </Timeline>
                                </Card>
                            </Col>
                        </Row>
                    </Card>
                </Row>
            </div>
        )
    }
}

export default Home;
