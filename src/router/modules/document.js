import Layout from '@/views/layout/Layout'

const documentRouter = {
  path: '/document',
  component: Layout,
  redirect: '/example/list',
  name: 'Document',
  meta: {
    title: 'document',
    icon: 'example'
  },
  children: [
    {
      path: 'create',
      component: () => import('@/views/example/create'),
      name: 'CreateArticle',
      meta: { title: 'createArticle', icon: 'edit' }
    },
    {
      path: 'edit/:id(\\d+)',
      component: () => import('@/views/example/edit'),
      name: 'EditArticle',
      meta: { title: 'editArticle', noCache: true },
      hidden: true
    },
    {
      path: 'list',
      component: () => import('@/views/example/list'),
      name: 'ArticleList',
      meta: { title: 'articleList', icon: 'list' }
    }
  ]
}

export default documentRouter
