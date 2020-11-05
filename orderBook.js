function reconcileOrder(existingBook, incomingOrder) {
  let key = 'a'
  let i = -1
  const buyEqualOrder = order => order.type === 'buy' && order.price >= incomingOrder.price
  if (existingBook.length) { i = existingBook.findIndex(buyEqualOrder) }
  if (i >= 0 && incomingOrder.quantity <= existingBook[i].quantity) { key = 'b' }
  if (i >= 0 && incomingOrder.quantity > existingBook[i].quantity) { key = 'c' }
  switch (key) {
    case 'a':
      existingBook.push(incomingOrder)
      return existingBook
    case 'b':
      existingBook[i].quantity -= incomingOrder.quantity
      if (existingBook[i].quantity > 0) { existingBook.push(existingBook.splice((i), 1)[0]) }
      existingBook = existingBook.filter(orders => orders.quantity > 0)
      return existingBook
    case 'c':
      incomingOrder.quantity -= existingBook[i].quantity
      existingBook[i].quantity = 0
      existingBook = existingBook.filter(orders => orders.quantity > 0)
      if (existingBook.findIndex(buyEqualOrder) >= 0) {
        existingBook = reconcileOrder(existingBook, incomingOrder)
      }
      else {
        existingBook.push(incomingOrder)
      }
      return existingBook
  }
}
module.exports = reconcileOrder