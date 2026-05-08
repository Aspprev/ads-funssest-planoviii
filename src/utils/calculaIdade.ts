function calculaIdade(nasc: string) {
  var hoje = new Date()
  var nascimento = new Date(nasc)
  var diferencaAnos = hoje.getFullYear() - nascimento.getFullYear()
  if (
    new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()) <
    new Date(hoje.getFullYear(), nascimento.getMonth(), nascimento.getDate())
  )
    diferencaAnos -= 1
  return diferencaAnos;
  }
export default calculaIdade
