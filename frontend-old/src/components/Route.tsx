import { ReactNode } from 'react';

type RouteProps = {
  path: string;
  children?: ReactNode | ReactNode[];
};

function Route({ path, children }: RouteProps) {
  return <>{window.location.pathname === path ? children : null}</>;
}

export default Route;
