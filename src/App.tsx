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
import Index from "@/page/system/mail";
import Log from "@/page/system/log";
import LoginLog from "@/page/system/login";
import Login from "@/Login";
import MailBox from "@/page/mailbox";
import Account from "@/page/account";

function App() {

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <HelmetProvider>
                <Router>
                    <Layout>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/" element={<Dashboard/>}/>
                            <Route path="/sys/users" element={<User/>}/>
                            <Route path="/sys/roles" element={<Role/>}/>
                            <Route path="/sys/department" element={<Department/>}/>
                            <Route path="/sys/position" element={<Position/>}/>
                            <Route path="/sys/mail" element={<Index/>}/>
                            <Route path="/sys/log" element={<Log/>}/>
                            <Route path="/sys/login-log" element={<LoginLog/>}/>
                            <Route path="/mail" element={<MailBox />} />
                            <Route path="/account" element={<Account />} />
                        </Routes>
                    </Layout>
                </Router>
            </HelmetProvider>
        </ThemeProvider>
    )
}

export default App
