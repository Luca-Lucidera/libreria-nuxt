import { H3Event } from 'h3';
import { BookToBuy } from 'types/bookToBuy';
export default defineEventHandler(async (event) => {
  const listaLibriDaComprare = await readBody(event)
  console.log(listaLibriDaComprare satisfies BookToBuy)
  if(listaLibriDaComprare satisfies BookToBuy) return "YEEE"
  else "NOT YEEE"

})