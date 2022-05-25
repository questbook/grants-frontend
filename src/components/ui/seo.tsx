import React from 'react'
import { NextSeo, NextSeoProps } from 'next-seo'
import seoConfig from 'src/constants/seo'

export type SEOProps = Pick<NextSeoProps, 'title' | 'description'>;

function SEO({ title, description }: SEOProps) {
	return (
		<NextSeo
			title={title}
			description={description}
			openGraph={{ title, description }}
			titleTemplate={seoConfig.titleTemplate}
		/>
	)
}

export default SEO
