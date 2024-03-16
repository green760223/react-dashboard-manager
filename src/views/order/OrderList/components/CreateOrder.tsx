import { useEffect, useImperativeHandle, useState } from 'react'
import { Modal, Form, Row, Col, Select, Input, DatePicker } from 'antd'
import { IModalProp } from '@/types/modal'
import { Order } from '@/types/api'
import api from '@/api/orderApi'
import { message } from '@/utils/AntdGlobal'

function CreateOrder(props: IModalProp) {
  const [visible, setVisible] = useState(false)
  const [cityList, setCityList] = useState<Order.DictItem[]>([])
  const [vehicleList, setVehicleList] = useState<Order.DictItem[]>([])
  const [form] = Form.useForm()

  useEffect(() => {
    getInitData()
  }, [])

  // 初始化數據（城市列表、車型列表）
  const getInitData = async () => {
    const citylist = await api.getCityList()
    const vehiclelist = await api.getVehicleList()
    setCityList(citylist)
    setVehicleList(vehiclelist)
  }

  useImperativeHandle(props.mRef, () => {
    return {
      open
    }
  })

  // 打開彈框
  const open = () => {
    setVisible(true)
  }

  // 創建訂單並提交
  const handleOk = async () => {
    const valid = await form.validateFields()
    if (valid) {
      await api.creatyOrder(form.getFieldsValue())
      message.success('創建訂單成功')
      handleCancel()
      props.update()
    } else {
      message.error('請填寫必填項')
    }
  }

  // 彈框關閉
  const handleCancel = () => {
    form.resetFields()
    setVisible(false)
  }

  return (
    <Modal
      title='創建訂單'
      width={800}
      open={visible}
      okText='確定'
      cancelText='取消'
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form
        form={form}
        layout='horizontal'
        labelAlign='right'
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Row>
          <Col span={12}>
            <Form.Item
              name='cityName'
              label='城市名稱'
              rules={[{ required: true, message: '請輸入城市名稱' }]}
            >
              <Select placeholder='請選擇城市名稱'>
                {cityList.map(item => {
                  return (
                    <Select.Option value={item.name} key={item.id}>
                      {item.name}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='vehicleName'
              label='車型名稱'
              rules={[{ required: true, message: '請選擇車型名稱' }]}
            >
              <Select placeholder='請選擇車型名稱'>
                {vehicleList.map(item => {
                  return (
                    <Select.Option value={item.name} key={item.id}>
                      {item.name}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              name='userName'
              label='用戶名稱'
              rules={[{ required: true, message: '請輸入用戶名稱' }]}
            >
              <Input placeholder='請輸入用戶名稱' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='mobile' label='手機號碼'>
              <Input placeholder='請輸入下單手機號碼' />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item name='startAddress' label='起始地址'>
              <Input placeholder='請輸入起始地址' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='endAddress' label='結束地址'>
              <Input placeholder='請輸入結束地址' />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              name='orderAmount'
              label='下單金額'
              rules={[{ required: true, message: '請輸入下單金額' }]}
            >
              <Input type='number' placeholder='請輸入下單金額' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='userPayAmount'
              label='支付金額'
              rules={[{ required: true, message: '請輸入支付金額' }]}
            >
              <Input type='number' placeholder='請輸入支付金額' />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              name='driverName'
              label='司機名稱'
              rules={[{ required: true, message: '請輸入司機名稱' }]}
            >
              <Input placeholder='請輸入司機名稱' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='driverAmount'
              label='司機金額'
              rules={[{ required: true, message: '請輸入司機金額' }]}
            >
              <Input type='number' placeholder='請輸入司機金額' />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item name='payType' label='支付方式'>
              <Select placeholder='請選擇支付方式'>
                <Select.Option value={1}>微信</Select.Option>
                <Select.Option value={2}>支付寶</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='state' label='訂單狀態'>
              <Select placeholder='請選擇訂單狀態'>
                <Select.Option value={1}>進行中</Select.Option>
                <Select.Option value={2}>已完成</Select.Option>
                <Select.Option value={3}>超時</Select.Option>
                <Select.Option value={4}>取消</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item name='useTime' label='用車時間'>
              <DatePicker placeholder='請選擇日期' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='endTime' label='結束時間'>
              <DatePicker placeholder='請選擇日期' />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default CreateOrder
