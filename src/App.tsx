import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import Forbidden from '@/403'
import ErrorPage from '@/500'
import Login from '@/Login'
import { MainLayout, RootLayout } from '@/layouts'
import Account from '@/page/account'
import { AiChat } from '@/page/chat'
import Dashboard from '@/page/dashboard'
import ChangeLog from '@/page/docs/changelog'
import Introduction from '@/page/docs/introduction'
import Start from '@/page/docs/start'
import Tutorials from '@/page/docs/tutorials'
import Home from '@/page/home'
import MailBox from '@/page/mailbox'
import Monitor from '@/page/monitor'
import PersonalSetting from '@/page/personal'
import Department from '@/page/system/department'
import Log from '@/page/system/log'
import LoginLog from '@/page/system/login'
import SendingMails from '@/page/system/mail'
import MailSender from '@/page/system/mail/MailSender'
import Position from '@/page/system/position'
import Role from '@/page/system/role'
import User from '@/page/system/user'

import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/403" element={<Forbidden />} />
          <Route path="/500" element={<ErrorPage />} />

          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/welcome" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sys/users" element={<User />} />
            <Route path="/sys/roles" element={<Role />} />
            <Route path="/sys/department" element={<Department />} />
            <Route path="/sys/position" element={<Position />} />
            <Route path="/sys/mail" element={<SendingMails />} />
            <Route path="/sys/mail/send" element={<MailSender />} />
            <Route path="/sys/log" element={<Log />} />
            <Route path="/sys/login-log" element={<LoginLog />} />
            <Route path="/mail" element={<MailBox />} />
            <Route path="/account" element={<Account />} />
            <Route path="/personal" element={<PersonalSetting />} />
            <Route path="/chat" element={<AiChat />} />
            <Route path="/monitor" element={<Monitor />} />
            <Route path="/docs/introduction" element={<Introduction />} />
            <Route path="/docs/getstarted" element={<Start />} />
            <Route path="/docs/tutorials" element={<Tutorials />} />
            <Route path="/docs/changelog" element={<ChangeLog />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
