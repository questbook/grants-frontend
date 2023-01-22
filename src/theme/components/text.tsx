export default {
	Text: {
		baseStyle: {
			color: 'black.1',
			fontSize: '16px',
			lineHeight: '20px',
			fontWeight: '400'
		},
		variants: {
			heading: {
				color: '#122224',
				fontWeight: '700',
				fontSize: '28px',
				lineHeight: '44px',
			},
			footer: {
				color: '#122224',
				fontWeight: '500',
				fontSize: '14px',
				lineHeight: '20px',
			},
			applicationText: {
				color: '#122224',
				fontSize: '16px',
				fontStyle: 'normal',
				fontWeight: '400',
				lineHeight: '24px',
				letterSpacing: '0.5px',
			},
			applicationTextHeading: {
				color: '#122224',
				fontWeight: '700',
				fontSize: '16px',
				lineHeight: '24px',
			},
			applicationFundingText: {
				color: '#414E50',
				fontWeight: '500',
				fontSize: '16px',
				lineHeight: '20px',
			},
			tableHeader: {
				fontSize: '16px',
				lineHeight: '24px',
				letterSpacing: 0.5,
				color: 'brand.500',
				fontWeight: '700',
			},
			tableBody: {
				fontSize: '16px',
				lineHeight: '24px',
				letterSpacing: 0.5,
				color: '#122224',
				fontWeight: '500',
			},
			// New v2 starts here
			v2_metadata: {
				fontSize: '12px',
				lineHeight: '16px',
				color: 'black.1'
			},
			v2_body: {
				fontSize: '14px',
				lineHeight: '20px',
				color: 'black.1'
			},
			v2_title: {
				fontSize: '16px',
				lineHeight: '24px',
				color: 'black.1'
			},
			v2_subheading: {
				fontSize: '20px',
				lineHeight: '24px',
				color: 'black.1'
			},
			v2_heading_3: {
				fontSize: '24px',
				lineHeight: '32px',
				color: 'black.1'
			},
			v2_heading_2: {
				fontSize: '32px',
				lineHeight: '40px',
				color: 'black.1'
			},
			v2_heading_1: {
				fontSize: '40px',
				lineHeight: '48px',
				color: 'black.1'
			},
			v2_subtitle: {
				fontSize: '13px',
				lineHeight: '18px',
				fontWeight: '400',
				color: 'black.3'
			},
			textButton: {
				fontSize: '14px',
				lineHeight: '20px',
				color: 'black.1',
				fontWeight: '500',
				cursor: 'pointer',
				_hover: {
					textDecoration: 'underline'
				}
			},
			openTag: {
				color:'green.1',
				background:'rgba(90, 183, 17, 0.2)',
				borderRadius:'2px',
				px:'8px',
				py:'4px',
				fontSize:'12px',
				fontWeight:'500',
				ml:'8px',
				display:'inline-block'
			},
			closedTag: {
				color: 'gray.5',
				background: 'gray.2',
				borderRadius:'2px',
				px:'8px',
				py:'4px',
				fontSize:'12px',
				fontWeight:'500',
				ml:'8px',
				display:'inline-block'
			}
		},
	},
}
