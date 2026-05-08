export function formatValue(value: number) {
  return Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/*Função que  simplifica valores (1.000 = 1k, 1.000.000 = 1m) */
export function formatValueReduced(
  num: number,
  digits: number,
  prefix?: string,
) {
  const si = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ]
  // const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break
    }
  }

  const reducedNumber = num / si[i].value
  return `${!!prefix ? `${prefix} ` : ''}${Intl.NumberFormat('pt-BR', {
    style: 'decimal',
  }).format(reducedNumber)} ${si[i].symbol}`
}
