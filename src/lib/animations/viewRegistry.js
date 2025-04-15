// src/lib/animations/viewRegistry.js

const views = new Map()

views.set('home', () => import('@/views/HomeView'))
views.set('about', () => import('@/views/AboutView'))
views.set('project', () => import('@/views/ProjectView'))
views.set('projects', () => import('@/views/ProjectsView'))
views.set('playground', () => import('@/views/PlaygroundView'))
views.set('error', () => import('@/views/ErrorView'))

export default views