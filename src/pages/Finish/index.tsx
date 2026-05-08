import React, { useEffect } from 'react'
import PageCard from '../../components/PageCard'
import PageLayout from '../../components/PageLayout'
import SectionDivider from '../../components/SectionDivider'
import { scrollToTop } from '../../utils/browser'

const Finish: React.FC = () => {
  useEffect(() => {
    scrollToTop()
  }, [])

  return (
    <PageLayout containerClassName="my-[35px] max-md:max-w-[500px]">
      <PageCard className="flex flex-col items-center">
        <strong className="mb-3 text-center text-base text-brand-400">
          Agradecemos pelo interesse em nosso plano.
        </strong>

        <SectionDivider className="mb-4 mt-8 w-2/3" />

        <strong className="mb-3 text-center text-base text-brand-400">
          Para mais informações, entre em contato conosco:
        </strong>
        <div className="flex flex-col items-center">
          <div className="mb-8 flex flex-col items-center">
            <p className="w-[80%] px-0 py-2 text-center text-sm">Telefone:</p>
            <span className="text-base font-bold text-brand-400">
              (27) 3348-1214
            </span>
          </div>

          <div className="flex flex-col items-center">
            <p className="w-[80%] px-0 py-2 text-center text-sm">Site:</p>
            <span className="text-base font-bold text-brand-400">
              <a
                className="text-brand-400 underline"
                href="https://www.funssest.com.br/"
              >
                www.funssest.com.br
              </a>
            </span>
          </div>
        </div>
      </PageCard>
    </PageLayout>
  )
}

export default Finish
