import lazyLoading from "./lazyLoading";
export function formatRoutes(routes){
  const routers = [];
  routes.forEach(router=> {
    let {
      path,
      alwaysShow,
      component,
      name,
      meta,
      icon,
      children,
      redirect
    } = router;
    if (children && children.length>=0) {
      children = formatRoutes(children);
    }
    var router = {
      path: path,
      alwaysShow,
      component:lazyLoading(component),
      name: name,
      icon: icon,
      meta: meta,
      children: children,
      redirect
    };
    routers.push(router);
  })
  return fmRoutes;
}
