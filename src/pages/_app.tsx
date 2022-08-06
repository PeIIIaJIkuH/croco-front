import { MantineProvider } from '@mantine/core'
import type { AppProps } from 'next/app'
import '../styles/globals.css'

const MyApp = ({ Component, pageProps }: AppProps) => {
	return (
		<MantineProvider withNormalizeCSS>
			<Component {...pageProps} />
		</MantineProvider>
	)
}

export default MyApp
