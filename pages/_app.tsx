import '../styles/globals.css'
import Layout from '../components/other/Layout'
import type { AppProps } from 'next/app'
import { AuthUserProvider } from '../firebase/auth';
import { store } from "../context/store";
import { Provider as ReduxProvider } from 'react-redux';
import { CookiesProvider } from "react-cookie"
import { ToastContainer } from 'react-toastify';
import '../styles/Test.css';

export default function App({ Component, pageProps }: AppProps) {

    return (
        <AuthUserProvider>
            <ReduxProvider store={store}>
                <CookiesProvider>
                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={true}
                        closeOnClick
                        rtl={false}
                        draggable
                        theme="colored"
                        icon={false}
                    />
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </CookiesProvider>
            </ReduxProvider>
        </AuthUserProvider>
    );
}
