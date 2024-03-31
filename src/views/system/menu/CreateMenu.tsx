import { Modal, Form, TreeSelect, Input, InputNumber, Radio } from 'antd'
import { IAction, IModalProp } from '@/types/modal'
import { useImperativeHandle, useState } from 'react'
import { Menu } from '@/types/api'
import { useForm } from 'antd/es/form/Form'
import { message } from '@/utils/AntdGlobal'
import { InfoCircleOutlined } from '@ant-design/icons'
import api from '@/api'

function CreateMenu(props: IModalProp<Menu.EditParams>) {
  const [form] = useForm()
  const [action, setAction] = useState<IAction>('create')
  const [visible, setVisible] = useState(false)
  const [menuList, setMenuList] = useState<Menu.MenuItem[]>([])

  const getMenuList = async () => {
    const data = await api.getMenuList()
    setMenuList(data)
  }

  useImperativeHandle(props.mRef, () => {
    return { open }
  })

  const open = (
    type: IAction,
    data?: Menu.EditParams | { parentId: string }
  ) => {
    setAction(type)
    setVisible(true)
    getMenuList()
    if (data) {
      form.setFieldsValue(data)
    }
  }

  // Submit the form
  const handleSubmit = async () => {
    const value = await form.validateFields()
    if (value) {
      if (action === 'create') {
        await api.createMenu(form.getFieldsValue())
      } else {
        await api.editMenu(form.getFieldsValue())
      }
      message.success('Operation successful')
      handleCancel()
      props.update()
    }
  }

  // Close and reset the modal
  const handleCancel = () => {
    setVisible(false)
    form.resetFields()
  }

  return (
    <Modal
      title={action === 'create' ? 'Create Menu' : 'Edit Menu'}
      width={800}
      open={visible}
      okText='Save'
      cancelText='Cancel'
      onOk={handleSubmit}
      onCancel={handleCancel}
    >
      <Form
        form={form}
        labelAlign='right'
        labelCol={{ span: 4 }}
        initialValues={{ menuType: 1, menuState: 1 }}
      >
        <Form.Item label='Menu ID' name='_id' hidden>
          <Input disabled />
        </Form.Item>

        <Form.Item label='Upper Menu' name='parentId'>
          <TreeSelect
            placeholder='Please select the upper menu'
            allowClear
            treeDefaultExpandAll
            fieldNames={{ label: 'menuName', value: '_id' }}
            treeData={menuList}
          ></TreeSelect>
        </Form.Item>

        <Form.Item label='Menu Type' name='menuType'>
          <Radio.Group>
            <Radio value={1}>Menu</Radio>
            <Radio value={2}>Button</Radio>
            <Radio value={3}>Page</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label='Manu Name'
          name='menuName'
          rules={[{ required: true, message: 'Please enter the menu name' }]}
        >
          <Input placeholder='Please enter the menu name' />
        </Form.Item>

        <Form.Item noStyle shouldUpdate>
          {() => {
            return form.getFieldValue('menuType') === 2 ? (
              <Form.Item label='Permission' name='menuCode'>
                <Input placeholder='Please enter permission' />
              </Form.Item>
            ) : (
              <>
                <Form.Item label='Menu Icon' name='icon'>
                  <Input placeholder='Please enter menu icon' />
                </Form.Item>

                <Form.Item label='Route Path' name='path'>
                  <Input placeholder='Please enter the route address' />
                </Form.Item>
              </>
            )
          }}
        </Form.Item>

        <Form.Item label='Component Name' name='component'>
          <Input placeholder='Please enter the component name' />
        </Form.Item>

        <Form.Item
          label='Order'
          name='orderBy'
          tooltip={{
            title: 'The larger the sorting value, the later it appears',
            icon: <InfoCircleOutlined rev={undefined} />
          }}
        >
          <InputNumber placeholder='Please enter the sorting value' />
        </Form.Item>

        <Form.Item label='Menu Status' name='menuState'>
          <Radio.Group>
            <Radio value={1}>Enable</Radio>
            <Radio value={2}>Disable</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateMenu
