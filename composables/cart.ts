import { Product, Variant } from "~~/types";
import { stringify } from 'qs'
import { Strapi4ResponseData } from '@nuxtjs/strapi/dist/runtime/types';

type CartProduct = Pick<Product, 'id' | 'count'> & Pick<Variant, 'weight'>

interface ProductResponse {
	data: Strapi4ResponseData<Product>[]
}

export const cartCookie = () => useCookie<CartProduct[]>('cartCookie', { maxAge: 9600000, default: () => [] })

export const useCartProducts = () => useState<Product[]>('cartProducts', () => [])

export const addToCart = async (product: CartProduct) => {
	const user = useUser()

	if (!user.value.email) {
		const cart = cartCookie()
		const products = [...cart.value]
		const productExist = products.find(item => item.id === product.id)
    
		if (productExist && productExist.weight === product.weight) {
			console.log(productExist);
      
			productExist.count++
		} else {
			products.push(product)
		}        

		cart.value = products
    
		await new Promise((resolve) => {
			setTimeout(() => resolve(fetchCartProducts()), 500)
		})
	}
}

export const removeFromCart = async (product: Omit<CartProduct, 'count'>) => {  
	const cart = cartCookie()
	const products = [...cart.value]

	const index = products.findIndex(({id, weight}) => id === product.id && weight === product.weight)

	products.splice(index, 1)
	cart.value = products
    
	await new Promise((resolve) => {
		setTimeout(() => resolve(fetchCartProducts()), 500)
	})
}

export const saveCart = () => {
	const cart = cartCookie();
	const cartProducts = useCartProducts();  

	const productsToSave: CartProduct[] = cartProducts.value.map(({ id, count, prices }) => ({ id, count, weight: prices[0].variants[0].weight }))

	cart.value = productsToSave
}

export const fetchCartProducts = async () => {
	const products = cartCookie();
	const cartProducts = useCartProducts();  

	const client = useStrapiClient()

	const query = stringify({
		filters: {
			id: {
				$in: products.value.length ? products.value.map(item => item.id) : '',
			},
		},
	}, {
		encodeValuesOnly: true,
	});

	const { data: response } = await client<ProductResponse>(`products?${query}&populate=*`)

	cartProducts.value = []

	products.value.forEach(item => {
		const { attributes } = JSON.parse(JSON.stringify(response.find(product => product.id === item.id))) as  Strapi4ResponseData<Product>
		const price = attributes.prices[0].variants.find(variant => variant.weight === item.weight).price

		attributes.count = item.count
		attributes.name = `${attributes.name} (${item.weight})`  

		attributes.prices[0].variants = [
			{
				price,
				weight: item.weight
			}
		]

		const productVariants = cartProducts.value.find(product => item.id === product.id && product.prices[0].variants[0].weight === item.weight)

		if (productVariants) {
			productVariants.count++
		} else cartProducts.value.push({...attributes, id: item.id})
	})  
}