import axios from 'axios';

import { BASE_URL } from './config';

import type {
	TGetSymbolsData,
	TConvertCyrrencyData,
	TGetSymbolsQuery,
} from '@/types/index';

export class CurrencyApi {
	static async getSymbols() {
		return axios
			.get<TGetSymbolsData>(`${BASE_URL}symbols`)
			.then((response) => {
				return response.data;
			})
			.catch((e) => console.log('getSymbols error: ', e));
	}

	static async convertCurrency({ from, to, amount }: TGetSymbolsQuery) {
		return axios
			.get<TConvertCyrrencyData>(
				`${BASE_URL}convert?from=${from}&to=${to}&amount=${amount}`
			)
			.then((response) => {
				return response.data;
			})
			.catch((e) => console.log('convertCurrency error: ', e));
	}
}
