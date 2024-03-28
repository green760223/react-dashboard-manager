import { Suspense } from 'react'
import { Spin } from 'antd'

/*
 * Lazy loading component
 * @param {React.LazyExoticComponent<() => JSX.Element>} components
 * @returns {React.ReactNode}
 */
export const lazyLoad = (
  Component: React.LazyExoticComponent<() => JSX.Element>
): React.ReactNode => {
  return (
    <Suspense
      fallback={
        <Spin
          size='large'
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
          }}
        />
      }
    >
      <Component />
    </Suspense>
  )
}
