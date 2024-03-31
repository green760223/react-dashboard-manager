import { useImperativeHandle, useState } from 'react'
import { Modal } from 'antd'
import { IModalProp } from '@/types/modal'
import { message } from '@/utils/AntdGlobal'
import FormRender, { useForm } from 'form-render'
import api from '@/api/orderApi'

function CreateOrder(props: IModalProp) {
  const [visible, setVisible] = useState(false)
  const form = useForm()

  // 初始化數據（城市列表、車型列表）
  const getInitData = async () => {
    const citylist = await api.getCityList()
    const vehiclelist = await api.getVehicleList()
    form.setSchema({
      cityName: {
        props: {
          options: citylist.map(item => ({
            label: item.name,
            value: item.name
          }))
        }
      },
      vehicleName: {
        props: {
          options: vehiclelist.map(item => ({
            label: item.name,
            value: item.name
          }))
        }
      }
    })
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
      await api.creatyOrder(form.getValues())
      message.success('Order created successfully!')
      handleCancel()
      props.update()
    } else {
      message.error('Please enter the city name')
    }
  }

  // 彈框關閉
  const handleCancel = () => {
    form.resetFields()
    setVisible(false)
  }

  // 表單配置
  const schema = {
    type: 'object',
    displayType: 'row',
    column: 2,
    labelWidth: 120,
    properties: {
      cityName: {
        title: 'City Name',
        type: 'srting',
        widget: 'select',
        placeholder: 'Please select the city',
        rules: [{ required: true, message: 'Please select the city' }]
      },
      vehicleName: {
        title: 'Vehicle Model',
        type: 'srting',
        widget: 'select',
        placeholder: 'Please select the vehicle model',
        rules: [{ required: true, message: 'Please select the vehicle model' }]
      },
      userName: {
        title: 'User Name',
        type: 'srting',
        widget: 'input',
        rules: [{ required: true, message: 'Please enter the username' }],
        placeholder: 'Please enter the username'
      },
      moile: {
        title: 'Mobile Number',
        type: 'srting',
        widget: 'inputNumber',
        placeholder: 'Please enter the phone number',
        rules: [
          {
            pattern: /^1[1-9]\d{9}$/,
            message: 'Please enter a valid phone number'
          }
        ]
      },
      startAddress: {
        title: 'Starting address',
        type: 'srting',
        widget: 'input',
        placeholder: 'Please enter the starting address'
      },
      endAddress: {
        title: 'Ending address',
        type: 'srting',
        widget: 'input',
        placeholder: 'Please enter the ending address'
      },
      orderAmount: {
        title: 'Order Amount',
        type: 'number',
        widget: 'inputNumber',
        placeholder: 'Please enter the order amount'
      },
      userAmount: {
        title: 'Payment Amount',
        type: 'number',
        widget: 'inputNumber',
        placeholder: 'Please enter the payment amount'
      },
      driverName: {
        title: 'Driver Name',
        type: 'string',
        widget: 'input',
        placeholder: 'Please enter the driver name',
        required: true
      },
      driverAmount: {
        title: 'Driver Payment mount',
        type: 'number',
        widget: 'inputNumber',
        placeholder: 'Please enter the driver payment amount',
        required: true
      },
      payType: {
        title: 'Payment Method',
        type: 'number',
        widget: 'select',
        placeholder: 'Please select the payment method',
        props: {
          options: [
            { label: 'WeChat Pay', value: 1 },
            { label: 'Alipay', value: 2 },
            { label: 'UnionPay', value: 3 }
          ]
        }
      },
      state: {
        title: 'Order Status',
        type: 'number',
        widget: 'select',
        placeholder: 'Please select the order status',
        props: {
          options: [
            { label: 'In Progress', value: 1 },
            { label: 'Completed', value: 2 },
            { label: 'Overdue', value: 3 },
            { label: 'Cancelled', value: 4 }
          ]
        }
      },
      useTime: {
        title: 'Use Time',
        type: 'string',
        widget: 'datePicker',
        placeholder: 'Please select the use time'
      },
      endTime: {
        title: 'End Time',
        type: 'string',
        widget: 'datePicker',
        placeholder: 'Please select the end time'
      }
    }
  }

  return (
    <Modal
      title='Create Order'
      width={1000}
      open={visible}
      okText='Submit'
      cancelText='Cancel'
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <FormRender
        locale='en-US'
        form={form}
        schema={schema}
        onMount={getInitData}
      />
    </Modal>
  )
}

export default CreateOrder
