import Layout from '@/layout'

const g2PlotRouter = {
  path: '/g2-plot',
  component: Layout,
  redirect: '/g2-plot/funnel',
  alwaysShow: true,
  meta: {
    title: 'g2 plot',
    icon: 'el-icon-s-data'
  },
  children: [
    {
      path: 'funnel',
      component: () => import('@/views/g2-plot/funnel'),
      name: 'PDF',
      meta: { title: 'funnel' }
    }
  ]
}

export default g2PlotRouter
