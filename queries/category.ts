import qs from 'qs'

export const categoryQuery = (param: string) => qs.stringify({
	fields: ['name', 'slug', 'color', 'subtitle'],
	filters: {
		slug: {
			$eq: param
		},
	},
	populate: {
		products: {
			populate: {
				images: {
					fields: ['formats'],
				},
				prices: {
					fields: '*'
				}
			},
			fields: ['name', 'slug', 'in_stock']
		},
	},
}, {
	encodeValuesOnly: true,
});