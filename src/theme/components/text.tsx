export default {
	Text: {
		baseStyle: {
			color: 'black.1',
			fontSize: '16px',
			lineHeight: '20px',
			fontWeight: '400'
		},
		variants: {
			metadata: {
				fontSize: '12px',
				lineHeight: '16px',
				color: 'black.1'
			},
			body: {
				fontSize: '14px',
				lineHeight: '20px',
				color: 'black.1'
			},
			title: {
				fontSize: '16px',
				lineHeight: '24px',
				color: 'black.1'
			},
			subheading: {
				fontSize: '20px',
				lineHeight: '24px',
				color: 'black.1'
			},
			heading3: {
				fontSize: '24px',
				lineHeight: '32px',
				color: 'black.1'
			},
			heading2: {
				fontSize: '32px',
				lineHeight: '40px',
				color: 'black.1'
			},
			heading1: {
				fontSize: '40px',
				lineHeight: '48px',
				color: 'black.1'
			},
			subtitle: {
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
