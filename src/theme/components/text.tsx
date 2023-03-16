export default {
	Text: {
		baseStyle: {
			color: 'black.100',
			fontSize: '16px',
			lineHeight: '20px',
			fontWeight: '400'
		},
		variants: {
			metadata: {
				fontSize: '12px',
				lineHeight: '16px',
				color: 'black.100'
			},
			body: {
				fontSize: '14px',
				lineHeight: '20px',
				color: 'black.100'
			},
			title: {
				fontSize: '16px',
				lineHeight: '24px',
				color: 'black.100'
			},
			subheading: {
				fontSize: '20px',
				lineHeight: '24px',
				color: 'black.100'
			},
			heading3: {
				fontSize: '24px',
				lineHeight: '32px',
				color: 'black.100'
			},
			heading2: {
				fontSize: '32px',
				lineHeight: '40px',
				color: 'black.100'
			},
			heading1: {
				fontSize: '40px',
				lineHeight: '48px',
				color: 'black.100'
			},
			subtitle: {
				fontSize: '13px',
				lineHeight: '18px',
				fontWeight: '400',
				color: 'black.300'
			},
			textButton: {
				fontSize: '14px',
				lineHeight: '20px',
				color: 'black.100',
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
				color: 'gray.500',
				background: 'gray.200',
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
