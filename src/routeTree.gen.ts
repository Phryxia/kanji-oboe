/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'

// Create Virtual Routes

const ConfigLazyImport = createFileRoute('/config')()
const StatisticsIndexLazyImport = createFileRoute('/statistics/')()
const StatisticsByGroupLazyImport = createFileRoute('/statistics/by-group')()
const StatisticsByCharacterLazyImport = createFileRoute(
  '/statistics/by-character',
)()

// Create/Update Routes

const ConfigLazyRoute = ConfigLazyImport.update({
  path: '/config',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/config.lazy').then((d) => d.Route))

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const StatisticsIndexLazyRoute = StatisticsIndexLazyImport.update({
  path: '/statistics/',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/statistics/index.lazy').then((d) => d.Route),
)

const StatisticsByGroupLazyRoute = StatisticsByGroupLazyImport.update({
  path: '/statistics/by-group',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/statistics/by-group.lazy').then((d) => d.Route),
)

const StatisticsByCharacterLazyRoute = StatisticsByCharacterLazyImport.update({
  path: '/statistics/by-character',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/statistics/by-character.lazy').then((d) => d.Route),
)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/config': {
      preLoaderRoute: typeof ConfigLazyImport
      parentRoute: typeof rootRoute
    }
    '/statistics/by-character': {
      preLoaderRoute: typeof StatisticsByCharacterLazyImport
      parentRoute: typeof rootRoute
    }
    '/statistics/by-group': {
      preLoaderRoute: typeof StatisticsByGroupLazyImport
      parentRoute: typeof rootRoute
    }
    '/statistics/': {
      preLoaderRoute: typeof StatisticsIndexLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexRoute,
  ConfigLazyRoute,
  StatisticsByCharacterLazyRoute,
  StatisticsByGroupLazyRoute,
  StatisticsIndexLazyRoute,
])

/* prettier-ignore-end */
