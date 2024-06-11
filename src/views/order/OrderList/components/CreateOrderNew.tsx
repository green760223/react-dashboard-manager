import { useImperativeHandle, useState, useEffect } from 'react'
import { Modal } from 'antd'
import { IModalProp } from '@/types/modal'
import { message } from '@/utils/AntdGlobal'
import { useTranslation } from 'react-i18next'
import FormRender, { useForm } from 'form-render'
import api from '@/api/orderApi'

function CreateOrder(props: IModalProp) {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const form = useForm()

  useEffect(() => {}, [t])

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

  // 建立訂單並提交
  const handleOk = async () => {
    const valid = await form.validateFields()
    if (valid) {
      await api.creatyOrder(form.getValues())
      message.success(t('orderPanel.createSuccess'))
      handleCancel()
      props.update()
    } else {
      message.error(t('orderPanel.orderDetailRequired'))
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
        title: t('orderPanel.cityName'),
        type: 'srting',
        widget: 'select',
        placeholder: t('orderPanel.selectCity'),
        rules: [{ required: true, message: t('orderPanel.selectCity') }]
      },
      vehicleName: {
        title: t('orderPanel.vehicleModel'),
        type: 'srting',
        widget: 'select',
        placeholder: t('orderPanel.selectVehicleModel'),
        rules: [{ required: true, message: t('orderPanel.selectVehicleModel') }]
      },
      userName: {
        title: t('orderPanel.userName'),
        type: 'srting',
        widget: 'input',
        rules: [{ required: true, message: t('orderPanel.enterUserName') }],
        placeholder: t('orderPanel.enterUserName')
      },
      moile: {
        title: t('orderPanel.mobile'),
        type: 'srting',
        widget: 'inputNumber',
        placeholder: t('orderPanel.enterMobile'),
        rules: [
          {
            pattern: /^1[1-9]\d{9}$/,
            message: t('orderPanel.enterValidMobile')
          }
        ]
      },
      startAddress: {
        title: t('orderPanel.startingAddress'),
        type: 'srting',
        widget: 'input',
        placeholder: t('orderPanel.enterStartingAddress')
      },
      endAddress: {
        title: t('orderPanel.endingAddress'),
        type: 'srting',
        widget: 'input',
        placeholder: t('orderPanel.enterEndingAddress')
      },
      orderAmount: {
        title: t('orderPanel.orderAmount'),
        type: 'number',
        widget: 'inputNumber',
        placeholder: t('orderPanel.enterOrderAmount')
      },
      userAmount: {
        title: t('orderPanel.paymentAmount'),
        type: 'number',
        widget: 'inputNumber',
        placeholder: t('orderPanel.enterPaymentAmount')
      },
      driverName: {
        title: t('orderPanel.driverName'),
        type: 'string',
        widget: 'input',
        rules: [{ required: true, message: t('orderPanel.enterDriverName') }],
        placeholder: t('orderPanel.enterDriverName')
      },
      driverAmount: {
        title: t('orderPanel.driverPaymentAmount'),
        type: 'number',
        widget: 'inputNumber',
        rules: [
          { required: true, message: t('orderPanel.enterDriverPaymentAmount') }
        ],
        placeholder: t('orderPanel.enterDriverPaymentAmount')
      },
      payType: {
        title: t('orderPanel.paymentMethod'),
        type: 'number',
        widget: 'select',
        placeholder: t('orderPanel.selectPaymentMethod'),
        props: {
          options: [
            { label: t('orderPanel.weChatPay'), value: 1 },
            { label: t('orderPanel.alipay'), value: 2 },
            { label: t('orderPanel.unionPay'), value: 3 }
          ]
        }
      },
      state: {
        title: t('orderPanel.orderStatus'),
        type: 'number',
        widget: 'select',
        placeholder: t('orderPanel.selectOrderStatus'),
        props: {
          options: [
            { label: t('orderPanel.inprogress'), value: 1 },
            { label: t('orderPanel.completed'), value: 2 },
            { label: t('orderPanel.overdue'), value: 3 },
            { label: t('orderPanel.cancelled'), value: 4 }
          ]
        }
      },
      useTime: {
        title: t('orderPanel.useTime'),
        type: 'string',
        widget: 'datePicker',
        placeholder: t('orderPanel.selectUseTime')
      },
      endTime: {
        title: t('orderPanel.endTime'),
        type: 'string',
        widget: 'datePicker',
        placeholder: t('orderPanel.selectEndTime')
      }
    }
  }

  return (
    <Modal
      title={t('orderPanel.createOrder')}
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
