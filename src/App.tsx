import './App.css'
import Layout from "@/layout";
import Dashboard from "@/page/dashboard";
import {ThemeProvider} from "@/components/theme-provider";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {HelmetProvider} from "react-helmet-async";
import User from "@/page/system/user";
import Role from "@/page/system/role";
import Department from "@/page/system/department";
import Position from "@/page/system/position";
import SendingMails from "@/page/system/mail";
import Log from "@/page/system/log";
import LoginLog from "@/page/system/login";
import Login from "@/Login";
import MailBox from "@/page/mailbox";
import Account from "@/page/account";
import MailSender from "@/page/system/mail/MailSender";
import {AiChat} from "@/page/chat";
import Monitor from "@/page/monitor";
import Forbidden from "@/403";
import ErrorPage from "@/500";
import Introduction from "@/page/docs/introduction";
import Start from "@/page/docs/start";
import Tutorials from "@/page/docs/tutorials";
import ChangeLog from "@/page/docs/changelog";

function App() {

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <HelmetProvider>
                <Router>
                    <Layout>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/" element={<Dashboard/>}/>
                            <Route path="/403" element={<Forbidden />} />
                            <Route path="/500" element={<ErrorPage />} />
                            <Route path="/sys/users" element={<User/>}/>
                            <Route path="/sys/roles" element={<Role/>}/>
                            <Route path="/sys/department" element={<Department/>}/>
                            <Route path="/sys/position" element={<Position/>}/>
                            <Route path="/sys/mail" element={<SendingMails/>}/>
                            <Route path="/sys/mail/send" element={<MailSender/>}/>
                            <Route path="/sys/log" element={<Log/>}/>
                            <Route path="/sys/login-log" element={<LoginLog/>}/>
                            <Route path="/mail" element={<MailBox />} />
                            <Route path="/account" element={<Account />} />
                            <Route path="/chat" element={<AiChat />} />
                            <Route path="/monitor" element={<Monitor />} />
                            <Route path="/docs/introduction" element={<Introduction />} />
                            <Route path="/docs/getstarted" element={<Start />} />
                            <Route path="/docs/tutorials" element={<Tutorials />} />
                            <Route path="/docs/changelog" element={<ChangeLog />} />
                        </Routes>
                    </Layout>
                </Router>
            </HelmetProvider>
        </ThemeProvider>
    )
}

export default App
