export default {
	Input: {
		variants: {
			brandFlushed: {
				field: {
					paddingLeft: 0,
					paddingRight: 0,
					borderRadius: '0px',
					borderBottom: '1px solid #D2D2E3',
					height: '2rem',
					fontWeight: '500',
					'&:focus': {
						borderBottom: '1px solid',
						borderColor: '#2B67F6',
						boxShadow: '0 1px 0 0 #2B67F6 !important'
					},
					'&:hover': {
						borderBottom: '1px solid',
						borderColor: '#2B67F6',
						boxShadow: '0px 1px 0px 0px #2B67F6'
					},
					'&[aria-invalid=true]': {
						borderBottom: '1px solid #F25A5A',
						boxShadow: '0px 1px 0px 0px #F25A5A'
					}
				}
			},
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
			}
		}
	}
}