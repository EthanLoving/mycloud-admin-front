import chartsRouter from '../router/modules/charts'
export function chartsRouters() {
  this.$router.addRoutes(chartsRouter);
  console.log(this.$router)
}
