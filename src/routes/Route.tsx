import React from 'react'
import {
  Route as ReactDOMRoute,
  RouteProps as ReactDOMRouterProps,
} from 'react-router-dom'

interface RouteProps extends ReactDOMRouterProps {
  component: React.ComponentType
}

const Route: React.FC<RouteProps> = ({ component: Component, ...rest }) => {
  const PageRendered = <Component />

  return <ReactDOMRoute {...rest} render={() => PageRendered} />
}

export default Route
