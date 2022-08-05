import type { AppProps } from 'next/app'
import { MantineProvider } from '@mantine/core'
import '../styles/globals.css'

const MyApp = ({ Component, pageProps }: AppProps) => {
    return (
        <MantineProvider withNormalizeCSS>
            <Component {...pageProps} />
        </MantineProvider>
    )
}

export default MyApp
