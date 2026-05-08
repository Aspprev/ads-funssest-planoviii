import React, { useEffect } from 'react'
import { Switch } from 'react-router-dom'

import Route from './Route'

import BemVindo from '../pages/BemVindo'
import Simulation from '../pages/Simulation'
import Register from '../pages/Register'
import ConfirmSMS from '../pages/ConfirmSMS'
import Welcome from '../pages/Welcome'
import Finish from '../pages/Finish'
import AportConfirmation from '../pages/AportConfirmation'
// import Taxation from '../pages/Taxation'
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

import { ConfigData } from '../utils/interfaces'
import usePersistedState from '../hooks/usePersistedState'
import clientConfig from '../services/clientConfig'
// import PersonalInfos from '../pages/PersonalInfos'
// import Contribuition from '../pages/Contribuition'
// import Benefit from '../pages/Benefit'
// import ConfirmOwnership from '../pages/ConfirmOwnership'
// import GoalSelection from '../pages/GoalSelection'
// import Terms from '../pages/Terms'
// import Login from '../pages/Login'
// import Help from '../pages/Help'

const Routes: React.FC = () => {
  const { codCliente, tipo, plano } = clientConfig()

  const [configData, setConfigData] = usePersistedState<ConfigData>(
    'configData',
    {} as ConfigData,
  )
  useEffect(() => {
    setConfigData({
      ...configData,
      codCliente,
      tipo,
      plano,
    })
  }, [])

  return (
    <Switch>
      <Route path="/" exact component={BemVindo} />
      <Route path="/simulation" component={Simulation} />
      <Route path="/register" exact component={Register} />
      <Route path="/register/confirm-sms" component={ConfirmSMS} />
      <Route path="/welcome" component={Welcome} />
      <Route path="/finish" component={Finish} />
      <Route path="/aport-confirmation" component={AportConfirmation} />
      {/* <Route path="/taxation" component={Taxation} > */}
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
      {/* <Route path="/personal-infos" component={PersonalInfos} /> */}
      {/* <Route path="/contribuition" component={Contribuition} />
      <Route path="/benefit" component={Benefit} />
      <Route path="/goal-selection" component={GoalSelection} />
      <Route path="/help" component={Help} />
      <Route path="/confirm-ownership" component={ConfirmOwnership} />
      <Route path="/terms" component={Terms} />
      <Route path="/login" component={Login} /> */}
    </Switch>
  )
}

export default Routes
