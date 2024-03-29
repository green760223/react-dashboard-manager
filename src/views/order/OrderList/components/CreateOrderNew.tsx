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

  // 表單配置
  const schema = {
    type: 'object',
    displayType: 'row',
    column: 2,
    labelWidth: 120,
    properties: {
      cityName: {
        title: '城市名稱',
        type: 'srting',
        widget: 'select',
        placeholder: '請選擇城市',
        rules: [{ required: true, message: '請選擇城市' }]
      },
      vehicleName: {
        title: '車型',
        type: 'srting',
        widget: 'select',
        placeholder: '請選擇車型',
        rules: [{ required: true, message: '請選擇車型' }]
      },
      userName: {
        title: '用戶名稱',
        type: 'srting',
        widget: 'input',
        rules: [{ required: true, message: '請輸入用戶名稱' }],
        placeholder: '請輸入用戶名稱'
      },
      moile: {
        title: '手機號碼',
        type: 'srting',
        widget: 'inputNumber',
        placeholder: '請輸入手機號碼',
        rules: [{ pattern: /^1[1-9]\d{9}$/, message: '請輸入有效的手機號碼' }]
      },
      startAddress: {
        title: '起始地址',
        type: 'srting',
        widget: 'input',
        placeholder: '請輸入起始地址'
      },
      endAddress: {
        title: '結束地址',
        type: 'srting',
        widget: 'input',
        placeholder: '請輸入結束地址'
      },
      orderAmount: {
        title: '下單金額',
        type: 'number',
        widget: 'inputNumber',
        placeholder: '請輸入下單金額'
      },
      userAmount: {
        title: '支付金額',
        type: 'number',
        widget: 'inputNumber',
        placeholder: '請輸入支付金額'
      },
      driverName: {
        title: '司機名稱',
        type: 'string',
        widget: 'input',
        placeholder: '請輸入司機名稱',
        required: true
      },
      driverAmount: {
        title: '司機金額',
        type: 'number',
        widget: 'inputNumber',
        placeholder: '請輸入司機金額',
        required: true
      },
      payType: {
        title: '支付方式',
        type: 'number',
        widget: 'select',
        placeholder: '請選擇支付方式',
        props: {
          options: [
            { label: '微信', value: 1 },
            { label: '支付寶', value: 2 },
            { label: '銀聯', value: 3 }
          ]
        }
      },
      state: {
        title: '訂單狀態',
        type: 'number',
        widget: 'select',
        placeholder: '請選擇訂單狀態',
        props: {
          options: [
            { label: '進行中', value: 1 },
            { label: '已完成', value: 2 },
            { label: '超時', value: 3 },
            { label: '取消', value: 4 }
          ]
        }
      },
      useTime: {
        title: '用車時間',
        type: 'string',
        widget: 'datePicker',
        placeholder: '請選擇用車時間'
      },
      endTime: {
        title: '結束時間',
        type: 'string',
        widget: 'datePicker',
        placeholder: '請選擇結束時間'
      }
    }
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
      <FormRender form={form} schema={schema} onMount={getInitData} />
    </Modal>
  )
}

export default CreateOrder
