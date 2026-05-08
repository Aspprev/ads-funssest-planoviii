export interface ConfigData {
  codCliente: number
  tipo: number
  plano: number
  token: string
  tipoContato: string
}

export interface ErroProps {
  title: string
  description?: string
}

export interface UserData {
  cpf: string
  admission: string
  name: string
  birthdate: string
  email: string
  phone: string
  patrocinadora: string
  dcrPatrocinadora: string
  matricula: string
  parental: string
}

export interface UserDetails {
  salario: number
  contribuicaoBasica: number
  contribuicaoPatrocinadora: number
  pctContribuicaoBasica: number
  pctContribuicaoPatrocinadora: number
  contribuicaoSuplementar: number
  contribuicaoSuplementarPatrocinadora: number
  tipoContribuicaosuplementar: string
  pctContribuicaoSuplementar: number
  pctContribuicaoPPR: number
  pctContribuicaoDecTerceiro: number
  periodicidade: string
  years: number
  age: number
  tributacao: string
  ppe: string
  usperson: string
  investor: string
}

export interface ParticipantDetails {
  tipoBen: string
  tipVinculo: string
  birthdate: Date
  proporcao: number
  grauParentesco: string
  dcrGrauParentesco: string
  mrcInvalidez: string
}

export interface Participant {
  data: {
    name: string
    cpf: string
    birthdate: string
  }
  details: {
    proporcao: number
    tipVinculo: string
    tipoBen: string
    grauParentesco: string
    dcrGrauParentesco: string
    mrcInvalidez: string
  }
}

export interface UserFiles {
  doc: (file: File) => void
}
