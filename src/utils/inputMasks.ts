
interface Event extends React.FormEvent<HTMLInputElement> {}

export type InputMaskType =
  | 'cep'
  | 'conta'
  | 'currency'
  | 'currencyV'
  | 'cpf'
  | 'phone'
  | 'date'
  | 'percent'

export const applyInputMask = (
  type: InputMaskType,
  inputValue: string,
): string => {
  const createEvent = {
    currentTarget: {
      value: inputValue,
      maxLength: 0,
    },
  } as Event

  return (masks[type] || masks.default)(createEvent).currentTarget.value
}

const cpf = (e: Event) => {
  e.currentTarget.maxLength = 14

  let value = e.currentTarget.value

  value = value.replace(/\D/g, '')
  value = value.replace(/(\d)(\d{2})$/, '$1-$2')
  value = value.replace(/(?=(\d{3})+(\D))\B/g, '.')

  e.currentTarget.value = value

  return e
}

const conta = (e: Event) => {
  e.currentTarget.maxLength = 21

  let value = e.currentTarget.value

  value = value.replace(/[-]/g, '')
  value = value.replace(/(.)(.{1})$/, '$1-$2')

  e.currentTarget.value = value

  return e
}

const cep = (e: Event) => {
  e.currentTarget.maxLength = 9

  let value = e.currentTarget.value

  value = value.replace(/\D/g, '')
  value = value.replace(/^(\d{5})(\d)/, '$1-$2')

  e.currentTarget.value = value

  return e
}

const currency = (e: Event) => {
  let value = e.currentTarget.value

  value = value.replace(/\D/g, '')
  value = value.replace(/(\d)(\d{2})$/, '$1,$2')
  value = value.replace(/(?=(\d{3})+(\D))\B/g, '.')

  e.currentTarget.value = value

  return e
}

const currencyV = (e: Event) => {
  let value = e.currentTarget.value

  value = value.replace(/\D/g, ''); // permite digitar apenas numero
  value = value.replace(/(\d{1})(\d{14})$/, '$1.$2'); // coloca ponto antes dos ultimos digitos
  value = value.replace(/(\d{1})(\d{11})$/, '$1.$2'); // coloca ponto antes dos ultimos 11 digitos
  value = value.replace(/(\d{1})(\d{8})$/, '$1.$2'); // coloca ponto antes dos ultimos 8 digitos
  value = value.replace(/(\d{1})(\d{5})$/, '$1.$2'); // coloca ponto antes dos ultimos 5 digitos
  value = value.replace(/(\d{1})(\d{1,2})$/, '$1,$2'); // coloca virgula antes dos ultimos 2 digitos

  e.currentTarget.value = value

  return e
}

const phone = (e: Event) => {
  e.currentTarget.maxLength = 15

  let value = e.currentTarget.value

  value = value.replace(/\D/g, '')
  value = value.replace(/^(\d{2})(\d)/g, '($1) $2')
  value = value.replace(/(\d)(\d{4})$/, "$1-$2");

  e.currentTarget.value = value

  return e
}

const date = (e: Event) => {
  e.currentTarget.maxLength = 10

  let value = e.currentTarget.value

  value = value.replace(/\D/g, '')
  value = value.replace(/(\d{2})(\d)/, '$1/$2')
  value = value.replace(/(\d{2})(\d)/, '$1/$2');

  e.currentTarget.value = value

  return e
}

const percent = (e: Event) => {
  e.currentTarget.maxLength = 5

  let value = e.currentTarget.value

  value = value.replace(/\D/g, ''); // permite digitar apenas numero
  value = value.replace(/(\d{1})(\d{1,1})$/, '$1.$2'); // coloca virgula antes dos ultimos 2 digitos

  e.currentTarget.value = value

  return e
}

const masks = {
  cep: (event: Event) => cep(event),
  currency: (event: Event) => currency(event),
  currencyV: (event: Event) => currencyV(event),
  cpf: (event: Event) => cpf(event),
  conta: (event: Event) => conta(event),
  phone: (event: Event) => phone(event),
  date: (event: Event) => date(event),
  percent: (event: Event) => percent(event),
  default: (event: Event) => event,
}

interface MaskFunctionValues {
  type: InputMaskType
  event: Event
}

export default ({ type, event }: MaskFunctionValues): Event => {
  return (masks[type] || masks.default)(event)
}
