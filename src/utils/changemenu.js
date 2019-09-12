import chartsRouter from '../router/modules/charts'
import router from '../router'
export function chartsRouters() {
  console.log("chartsRouter===>"+chartsRouter)
  router.push(chartsRouter);
  console.log(router)
}
