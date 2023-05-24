function dateIsSameMonth(currentDate, dateStr) {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = date.getMonth()
  return currentDate.getFullYear() === year && currentDate.getMonth() === month
}

const utils = {
  dateIsSameMonth: dateIsSameMonth
}

export default utils
