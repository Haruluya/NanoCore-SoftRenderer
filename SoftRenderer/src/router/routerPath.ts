export const routes = [
    {
        path: '/',
        component: () => import('../pages/Main/index.vue'),
    },
    {
        path: '/drawframe',
        component: () => import('../pages/DrawFrame/index.vue'),
    },
    {
        path: '/drawfaces',
        component: () => import('../pages/DrawFaces/index.vue'),
    },
    {
        path: '/zbuffer',
        component: () => import('../pages/ZBuffer/index.vue'),
    },
    {
        path: '/camera',
        component: () => import('../pages/Camera/index.vue'),
    },
    {
        path: '/texture',
        component: () => import('../pages/Texture/index.vue'),
    },
]