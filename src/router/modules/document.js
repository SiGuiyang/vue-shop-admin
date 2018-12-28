import Layout from '@/views/layout/Layout'

const documentRouter = {
  path: '/document',
  component: Layout,
  redirect: '/document/list',
  name: 'Document',
  meta: {
    title: 'document',
    icon: 'documentation',
    permission: ['admin']
  },
  children: [
    {
      path: 'create',
      component: () => import('@/views/document/create'),
      name: 'CreateArticle',
      meta: { title: 'createArticle', icon: 'edit', permission: ['admin'] }
    },
    {
      path: 'edit/:id(\\d+)',
      component: () => import('@/views/document/edit'),
      name: 'EditArticle',
      meta: { title: 'editArticle', noCache: true, permission: ['admin'] },
      hidden: true
    },
    {
      path: 'list',
      component: () => import('@/views/document/list'),
      name: 'ArticleList',
      meta: { title: 'articleList', icon: 'list', permission: ['admin'] }
    }
  ]
}

export default documentRouter
