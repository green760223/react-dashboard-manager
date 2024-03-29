import { Role } from '@/types/api'
import { IModalProp, IAction } from '@/types/modal'
import { Modal, Form, Tree } from 'antd'
import { useEffect, useImperativeHandle, useState } from 'react'
import { message } from '@/utils/AntdGlobal'
import api from '@/api/index'
import roleApi from '@/api/roleApi'
import { Menu } from '@/types/api'

function SetPermission(props: IModalProp<Role.RoleItem>) {
  const [visible, setVisible] = useState(false)
  const [checkedKeys, setCheckedKeys] = useState<string[]>([])
  const [menuList, setMenuList] = useState<Menu.MenuItem[]>([])
  const [roleInfo, setRoleInfo] = useState<Role.RoleItem>()
  const [permission, setPermission] = useState<Role.Permission>()

  useEffect(() => {
    getMenuList()
  }, [])

  const getMenuList = async () => {
    const menuList = await api.getMenuList()
    setMenuList(menuList)
  }

  useImperativeHandle(props.mRef, () => {
    return {
      open
    }
  })

  const open = (_type: IAction, data?: Role.RoleItem) => {
    setVisible(true)
    setRoleInfo(data)
    setCheckedKeys(data?.permissionList.checkedKeys || [])
  }

  // 提交新增角色
  const handleOk = async () => {
    if (permission) {
      await roleApi.updatePermission(permission)
      message.success('操作成功')
      handleCancel()
      props.update()
    }
  }

  // 取消新增角色
  const handleCancel = () => {
    setVisible(false)
    setPermission(undefined)
  }

  // 確認權限
  const onCheck = (checkedKeysValues: any, item: any) => {
    setCheckedKeys(checkedKeysValues)
    const checkedKeys: string[] = []
    const parentKeys: string[] = []

    item.checkedNodes.map((node: Menu.MenuItem) => {
      if (node.menuType == '2') {
        checkedKeys.push(node._id)
      } else {
        parentKeys.push(node._id)
      }
    })

    setPermission({
      _id: roleInfo?._id || '',
      permissionList: {
        checkedKeys,
        halfCheckedKeys: parentKeys.concat(item.halfCheckedKeys)
      }
    })
  }

  return (
    <Modal
      title='設置權限'
      width={600}
      open={visible}
      okText='確定'
      cancelText='取消'
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form labelAlign='right' labelCol={{ span: 4 }}>
        <Form.Item label='角色名稱'>{roleInfo?.roleName}</Form.Item>

        <Form.Item label='權限'>
          <Tree
            defaultExpandAll
            fieldNames={{
              title: 'menuName',
              key: '_id',
              children: 'children'
            }}
            checkable
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            treeData={menuList}
          ></Tree>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default SetPermission
