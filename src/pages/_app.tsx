import { MantineProvider, Paper } from '@mantine/core'
import type { AppProps } from 'next/app'
import React from 'react'
import '../styles/globals.css'

const MyApp = ({ Component, pageProps }: AppProps) => {
	return (
		<MantineProvider withNormalizeCSS>
			<Paper className='wrapper' radius={0} p={20}>
				<Component {...pageProps} />
			</Paper>
		</MantineProvider>
	)
}

export default MyApp
