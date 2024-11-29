import './App.css'
import Layout from "@/layout";
import Dashboard from "@/page/dashboard";
import {ThemeProvider} from "@/components/theme-provider";

function App() {

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Layout>
                <Dashboard/>
            </Layout>
        </ThemeProvider>
    )
}

export default App
