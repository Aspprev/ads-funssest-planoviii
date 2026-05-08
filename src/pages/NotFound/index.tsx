import React from 'react'
import { useHistory } from 'react-router-dom'
import notFoundImg from '../../assets/not-found.png'
import Button from '../../components/Button'
import PageCard from '../../components/PageCard'
import PageLayout from '../../components/PageLayout'

const NotFound: React.FC = () => {
  const history = useHistory()

  return (
    <PageLayout containerClassName="my-9 max-md:max-w-120">
      <PageCard className="flex min-h-100 flex-col items-center justify-center">
        <img className="w-full" src={notFoundImg} alt="404 error" />
        <h3 className="mx-auto my-5 w-4/5 text-center text-[20px] max-md:text-base">
          Ops, não tem nada por aqui...
        </h3>

        <Button type="button" color="orange" onClick={() => history.goBack()}>
          VOLTAR
        </Button>
      </PageCard>
    </PageLayout>
  )
}

export default NotFound
