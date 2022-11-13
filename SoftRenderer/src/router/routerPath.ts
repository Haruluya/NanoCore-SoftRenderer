export const routes = [
    {
        path: '/',
        component: () => import('../pages/Main/index.vue'),
    },
    {
        path: '/drawframe',
        component: () => import('../pages/DrawFrame/index.vue'),
    },
]