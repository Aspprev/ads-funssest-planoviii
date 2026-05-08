import React, { useCallback, useEffect } from 'react'
import Img11 from '../../assets/ilustracao_tela11.png'
import PageCard from '../../components/PageCard'
import PageLayout from '../../components/PageLayout'
import SectionDivider from '../../components/SectionDivider'
import usePersistedState from '../../hooks/usePersistedState'
import { scrollToTop } from '../../utils/browser'

const End: React.FC = () => {
  const [flagAssistencial] = usePersistedState('flagAssistencial', '')

  const handleClick = useCallback(() => {
    window.location.assign('https://funssest.greendocs.net/')
  }, [])

  useEffect(() => {
    scrollToTop()
  }, [])

  return (
    <PageLayout containerClassName="my-[35px] max-md:max-w-[500px]">
      <PageCard className="flex flex-col items-center">
        <strong className="mb-3 text-center text-base text-brand-400 max-md:text-lg">
          Pronto! Seu pedido de adesão ao Plano VIII Funssest foi salvo com
          sucesso!
        </strong>

        <img className="my-8 h-45 w-auto max-md:h-50" src={Img11} alt="Confirmação de adesão" />

        <p className="w-4/5 pb-5 text-center text-sm leading-5 max-md:w-9/10 max-md:text-[17px] max-md:leading-4">
          Vamos avaliar seus dados e em breve você receberá a confirmação da
          adesão ao Plano VIII Funssest por e-mail!
        </p>
        {flagAssistencial === 'S' ? (
          <div className="contents">
            <SectionDivider className="mx-4 my-5 w-2/3" />
            <p className="w-4/5 pb-5 text-center text-sm leading-5 max-md:w-[90%] max-md:text-[17px] max-md:leading-4">
              Você está alocado na unidade Tubarão? Agora você já pode contratar
              a Cobertura Suplementar, produto da gestão do Plano de Saúde da
              Funssest.
            </p>
            <button
              type="button"
              className="mb-4 rounded-full bg-linear-to-r from-[#FF612E] to-[#FF8F61] px-5 py-3 text-sm font-bold text-white shadow-[0_2px_4px_rgba(0,0,0,0.08),0_4px_8px_rgba(61,69,67,0.08)]"
              onClick={handleClick}
            >
              Adquirir cobertura suplementar
            </button>
          </div>
        ) : null}
        <SectionDivider className="mx-4 my-5 w-2/3" />
        <div className="flex flex-col items-center">
          <strong className="mb-3 text-center text-base text-brand-400">
            Acesse o nosso site:
          </strong>
          <a
            className="flex items-center text-ink-900 no-underline hover:underline"
            href="https://www.funssest.com.br/"
          >
            www.funssest.com.br
          </a>
        </div>
      </PageCard>
    </PageLayout>
  )
}

export default End
