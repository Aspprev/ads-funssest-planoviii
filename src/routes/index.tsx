import React from 'react'
import { Switch } from 'react-router-dom'

import Route from './Route'

import Contribution from '../pages/Contribution'
import Simulation from '../pages/Simulation'
import Register from '../pages/Register'
import ConfirmSMS from '../pages/ConfirmSMS'
import Welcome from '../pages/Welcome'
import Finish from '../pages/Finish'
import AportConfirmation from '../pages/AportConfirmation'
import FatcaInfo from '../pages/FatcaInfo'
import Investor from '../pages/Investor'
import Attachment from '../pages/Attachment'
import NovoParticipante from '../pages/NovoParticipante'
import ParticipantsList from '../pages/ParticipantsList'
import CarePlan from '../pages/CarePlan'
import Resume from '../pages/Resume'
import Conclusion from '../pages/Conclusion'
import End from '../pages/End'
import Erro from '../pages/Erro'
import NotFound from '../pages/NotFound'
import useConfigData from '../hooks/useConfigData'

const Routes: React.FC = () => {
  useConfigData()

  return (
    <Switch>
      <Route path="/" exact component={Register} />
      <Route path="/register" exact component={Register} />
      <Route path="/contribution" component={Contribution} />
      <Route path="/simulation" component={Simulation} />
      <Route path="/register/confirm-sms" component={ConfirmSMS} />
      <Route path="/welcome" component={Welcome} />
      <Route path="/finish" component={Finish} />
      <Route path="/aport-confirmation" component={AportConfirmation} />
      <Route path="/pep-fatca" component={FatcaInfo} />
      <Route path="/investor" component={Investor} />
      <Route path="/attachment" component={Attachment} />
      <Route path="/new-participant" component={NovoParticipante} />
      <Route path="/participants-list" component={ParticipantsList} />
      <Route path="/care-plan" component={CarePlan} />
      <Route path="/resume" component={Resume} />
      <Route path="/conclusion" component={Conclusion} />
      <Route path="/end" component={End} />

      <Route path="/erro" component={Erro} />
      <Route path="*" component={NotFound} />
    </Switch>
  )
}

export default Routes
