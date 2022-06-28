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
			}
		}
	}
}