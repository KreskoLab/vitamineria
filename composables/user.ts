import { Ref } from 'vue'
import type { User } from '~/types'

export const useUser = () => useState('user', () => ({}) as Ref<User>)

export const useFetchUser = async () => {
	const user = useState('user', () => ({}) as Ref<User>)
	const client = useStrapiClient()
  
	try {
		const jwtCookie = useCookie('strapi_jwt')

		const response = await client<User>('/users/me?populate[cart][populate][0]=images', { 
			headers: {
				Authorization: `Bearer ${jwtCookie.value}`
			} 
		})
		
		user.value = response
	} catch (error) {
		user.value = {} as User
	}
}

export const useLogOut = () => {
	const { logout } = useStrapiAuth()

	logout()

	const user = useUser()
	user.value = {} as User
}
