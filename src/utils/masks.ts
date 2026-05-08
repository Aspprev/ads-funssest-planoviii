/* Função que Determina as expressões regulares dos objetos */
export function leech(v: string) {
  v = v.replace(/o/gi, '0')
  v = v.replace(/i/gi, '1')
  v = v.replace(/z/gi, '2')
  v = v.replace(/e/gi, '3')
  v = v.replace(/a/gi, '4')
  v = v.replace(/s/gi, '5')
  v = v.replace(/t/gi, '7')

  return v
}

/* Função que permite apenas numeros */
export function Integer(v: string) {
  return v.replace(/\D/g, '')
}

/* Função que permite apenas numeros Romanos */
export function Romanos(v: string) {
  v = v.toUpperCase()
  v = v.replace(/[^IVXLCDM]/g, '')

  while (
    v.replace(
      /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/,
      '',
    ) !== ''
  )
    v = v.replace(/.$/, '')

  return v
}

/* Função que padroniza DATA */
export function Data(v: string) {
  v = v.replace(/\D/g, '')
  v = v.replace(/(\d{2})(\d)/, '$1/$2')
  v = v.replace(/(\d{2})(\d)/, '$1/$2')

  return v
}

/* Função que padroniza DATA */
export function Hora(v: string) {
  v = v.replace(/\D/g, '')
  v = v.replace(/(\d{2})(\d)/, '$1:$2')

  return v
}

/* Função que padroniza Area */
export function Area(v: string) {
  v = v.replace(/\D/g, '')
  v = v.replace(/(\d)(\d{2})$/, '$1.$2')

  return v
}

/* Função que padroniza telefone 94184-1241 ou 9184-1241 */
export function Telefone(v: string) {
  if (v.replace('-', '').length === 8) {
    v = v.replace(/\D/g, '')
    v = v.replace(/(\d{4})(\d)/, '$1-$2')
  } else {
    v = v.replace(/\D/g, '')
    v = v.replace(/(\d{5})(\d)/, '$1-$2')
  }
  return v
}

/* Função que padroniza telefone (31) 94184-1241 ou (31) 9184-1241 */
export function TelefoneDDD(v: string) {
  if (
    v.replace('-', '').replace('(', '').replace(' ', '').replace(')', '')
      .length === 10
  ) {
    v = v.replace(/\D/g, '')
    v = v.replace(/^(\d\d)(\d)/g, '($1) $2')
    v = v.replace(/(\d{4})(\d)/, '$1-$2')
  } else {
    v = v.replace(/\D/g, '')
    v = v.replace(/^(\d\d)(\d)/g, '($1) $2')
    v = v.replace(/(\d{5})(\d)/, '$1-$2')
  }
  return v
}

/* Função que padroniza telefone (11) 41841241 */
export function TelefoneCall(v: string) {
  v = v.replace(/\D/g, '')
  v = v.replace(/^(\d\d)(\d)/g, '($1) $2')

  return v
}

/* Função que padroniza CPF */
export function Cpf(v: string) {
  v = v.replace(/\D/g, '')
  v = v.replace(/(\d{3})(\d)/, '$1.$2')
  v = v.replace(/(\d{3})(\d)/, '$1.$2')
  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2')

  return v
}

/* Função que padroniza CEP */
export function Cep(v: string) {
  v = v.replace(/D/g, '')
  v = v.replace(/^(\d{5})(\d)/, '$1-$2')

  return v
}

/* Função que padroniza CNPJ */
export function Cnpj(v: string) {
  v = v.replace(/\D/g, '')
  v = v.replace(/^(\d{2})(\d)/, '$1.$2')
  v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
  v = v.replace(/\.(\d{3})(\d)/, '.$1/$2')
  v = v.replace(/(\d{4})(\d)/, '$1-$2')

  return v
}

/* Função que padroniza valor monétario */
export function Valor(v: string) {
  v = v.replace(/\D/g, '') // permite digitar apenas numero
  v = v.replace(/(\d{1})(\d{14})$/, '$1.$2') // coloca ponto antes dos ultimos digitos
  v = v.replace(/(\d{1})(\d{11})$/, '$1.$2') // coloca ponto antes dos ultimos 11 digitos
  v = v.replace(/(\d{1})(\d{8})$/, '$1.$2') // coloca ponto antes dos ultimos 8 digitos
  v = v.replace(/(\d{1})(\d{5})$/, '$1.$2') // coloca ponto antes dos ultimos 5 digitos
  v = v.replace(/(\d{1})(\d{1,2})$/, '$1,$2') // coloca virgula antes dos ultimos 2 digitos
  return `R$ ${v}`
}

/* Função que padroniza valor monétario */
export function ValorMascarar(v: string) {
  v = v.replace(/\D/g, '') // permite digitar apenas numero
  v = v.replace(/(\d{1})(\d{14})$/, '$1.$2') // coloca ponto antes dos ultimos digitos
  v = v.replace(/(\d{1})(\d{11})$/, '$1.$2') // coloca ponto antes dos ultimos 11 digitos
  v = v.replace(/(\d{1})(\d{8})$/, '$1.$2') // coloca ponto antes dos ultimos 8 digitos
  v = v.replace(/(\d{1})(\d{5})$/, '$1.$2') // coloca ponto antes dos ultimos 5 digitos
  v = v.replace(/(\d{1})(\d{1,2})$/, '$1,$2') // coloca virgula antes dos ultimos 2 digitos
  return `${v}`
}
