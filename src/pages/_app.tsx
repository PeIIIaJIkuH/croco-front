import {MantineProvider, Paper} from '@mantine/core'
import {enableStaticRendering} from 'mobx-react-lite'
import type {AppProps} from 'next/app'
import Head from 'next/head'
import React from 'react'
import '../styles/globals.css'

enableStaticRendering(typeof window === 'undefined')


const MyApp = ({Component, pageProps}: AppProps) => {
	return (
		<>
			<Head>
				<title>Croco</title>
			</Head>
			<MantineProvider withNormalizeCSS>
				<Paper className='wrapper' radius={0} p={20}>
					<Component {...pageProps} />
				</Paper>
			</MantineProvider>
		</>
	)
}

export default MyApp
