import { ReactElement, ReactNode } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { ChatWidget } from '@papercups-io/chat-widget'
import { NextPage } from 'next'
import type { AppContext, AppProps } from 'next/app'
import App from 'next/app'
import Head from 'next/head'
import { DefaultSeo } from 'next-seo'
import favIcon from 'public/favicon.ico'
import { ApiClientsContextProvider } from 'src/contexts/ApiClientsContext'
import { BiconomyContextProvider } from 'src/contexts/BiconomyContext'
import { GrantProgramContextProvider } from 'src/contexts/GrantProgramContext'
import { SafeProvider } from 'src/contexts/safeContext'
import { WagmiProvider } from 'src/contexts/WagmiContext'
import { WebwalletContextProvider } from 'src/contexts/WebwalletContext'
import { DAOSearchContextMaker } from 'src/hooks/DAOSearchContext'
import { QBAdminsContextMaker } from 'src/hooks/QBAdminsContext'
import MigrateToGasless from 'src/libraries/ui/MigrateToGaslessModal'
import theme from 'src/theme'
import getSeo from 'src/utils/seo'
import 'styles/globals.css'
import 'draft-js/dist/Draft.css'
import 'src/utils/appCopy'

type NextPageWithLayout = NextPage & {
	getLayout?: (page: ReactElement) => ReactNode
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
	const seo = getSeo()

	const getLayout = Component.getLayout || ((page) => page)
	return (
		<>
			<DefaultSeo {...seo} />
			<Head>
				<link
					rel='shortcut icon'
					href={favIcon.src}
					type='image/x-icon' />
				<script
					async
					src='https://www.googletagmanager.com/gtag/js?id=G-N9KVED0HQZ'
				/>
				<script
					// eslint-disable-next-line react/no-danger
					dangerouslySetInnerHTML={
						{
							__html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '[Tracking ID]', { page_path: window.location.pathname });
            `,
						}
					}
				/>
				<script
					dangerouslySetInnerHTML={
						{
							__html: `(function(h,o,t,j,a,r){
								h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
								h._hjSettings={hjid:3220839,hjsv:6};
								a=o.getElementsByTagName('head')[0];
								r=o.createElement('script');r.async=1;
								r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
								a.appendChild(r);
							})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`
						}
					}
				/>
			</Head>
			<WagmiProvider>
				<ApiClientsContextProvider>
					<WebwalletContextProvider>
						<BiconomyContextProvider>
							<SafeProvider>
								<DAOSearchContextMaker>
									<GrantProgramContextProvider>
										<QBAdminsContextMaker>
											<ChakraProvider theme={theme}>
												{getLayout(<Component {...pageProps} />)}
												{
													typeof window !== 'undefined' && (
														<MigrateToGasless />
													)
												}
											</ChakraProvider>
										</QBAdminsContextMaker>
									</GrantProgramContextProvider>
								</DAOSearchContextMaker>
							</SafeProvider>
						</BiconomyContextProvider>
					</WebwalletContextProvider>
				</ApiClientsContextProvider>
			</WagmiProvider>
			<ChatWidget
				token='5b3b08cf-8b27-4d4b-9c4e-2290f53e04f0'
				inbox='cb5e60c6-dfe5-481d-9dde-3f13e83344cd'
				title='Welcome to Questbook Support'
				subtitle="Have a question? Please feel free to ask here - we'll respond ASAP, hopefully now!"
				primaryColor='#1F1F33'
				newMessagePlaceholder='Type your question ...'
				showAgentAvailability={false}
				agentAvailableText="We're online right now!"
				agentUnavailableText="We're away at the moment."
				requireEmailUpfront={false}
				iconVariant='filled'
				baseUrl='https://app.papercups.io'
			/>

		</>
	)
}

MyApp.getInitialProps = async(appContext: AppContext) => {
	// calls page's `getInitialProps` and fills `appProps.pageProps`
	const appProps = await App.getInitialProps(appContext)
	return { ...appProps }
}

// export default dynamic(() => Promise.resolve(MyApp), {
//   ssr: false,
// });
export default MyApp
