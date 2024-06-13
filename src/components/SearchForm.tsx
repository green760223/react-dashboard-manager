import { Form, Space, Button } from 'antd'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * 搜索表單容器組件封裝
 * @param props
 * @returns
 */
function SearchForm(props: any) {
  const { t } = useTranslation()

  useEffect(() => {}, [t])

  return (
    <Form
      className='search-form'
      form={props.form}
      layout='inline'
      initialValues={props.initialValues}
    >
      {
        // 遍歷搜索表單元素
        props.children
      }
      <Form.Item>
        <Space>
          <Button type='primary' onClick={props.submit}>
            {t('searchForm.search')}
          </Button>
          <Button type='default' onClick={props.reset}>
            {t('searchForm.reset')}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default SearchForm
