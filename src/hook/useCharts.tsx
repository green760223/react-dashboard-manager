import * as echarts from 'echarts'
import { RefObject, useEffect, useRef, useState } from 'react'

export const useCharts = (): [
  RefObject<HTMLDivElement>,
  echarts.EChartsType | undefined
] => {
  const chartRef = useRef<HTMLDivElement>(null)
  const [chartInstance, setChartInstance] = useState<echarts.EChartsType>()

  useEffect(() => {
    const chart = echarts.init(chartRef.current as HTMLDivElement)
    setChartInstance(chart)
  }, [])

  return [chartRef, chartInstance]
}
