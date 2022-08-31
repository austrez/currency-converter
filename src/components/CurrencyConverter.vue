<template>
	<div class="currency-converter">
		<div class="currency-converter__container">
			<label class="base-input-wrapper">
				<span class="base-input-title">From:</span>

				<input
					v-model="fromCurrencyValue"
					@input="onInput"
					:name="INPUT_NAMES.FROM"
					class="base-input"
					type="text"
					autocomplete="off"
				/>
			</label>

			<select
				v-model="fromCurrency"
				@input="onInput"
				:name="INPUT_NAMES.FROM"
				class="base-select"
			>
				<option v-for="value in symbols" :key="value.code" :value="value.code">
					{{ value.description }}
				</option>
			</select>
		</div>

		<div class="currency-converter__container">
			<label class="base-input-wrapper">
				<span class="base-input-title">To:</span>

				<input
					v-model="toCurrencyValue"
					@input="onInput"
					:name="INPUT_NAMES.TO"
					class="base-input"
					type="text"
					autocomplete="off"
				/>
			</label>

			<select
				v-model="toCurrency"
				@input="onInput"
				:name="INPUT_NAMES.TO"
				class="base-select"
			>
				<option v-for="value in symbols" :key="value.code" :value="value.code">
					{{ value.description }}
				</option>
			</select>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, nextTick, reactive, ref } from 'vue';
import { CurrencyApi } from '@/api/api';

import type { TSymbol, TGetSymbolsQuery } from '@/types/index';

enum INPUT_NAMES {
	FROM = 'FROM',
	TO = 'TO',
}

const DEFAULT_CURRENCIES = {
	USD: 'USD',
	RUB: 'RUB',
	EUR: 'EUR',
};

const SUPPORTED_LANGS = {
	en: 'en',
	ru: 'ru',
};

const getConvertionResult = async ({
	from,
	to,
	amount,
}: TGetSymbolsQuery): Promise<number> => {
	const data = await CurrencyApi.convertCurrency({
		from,
		to,
		amount,
	});

	return data?.result || 0;
};

export default defineComponent({
	setup() {
		const symbols = reactive<TSymbol[]>([]);
		const fromCurrencyValue = ref<string>('0');
		const toCurrencyValue = ref<string>('0');
		const fromCurrency = ref<string>('');
		const toCurrency = ref<string>('');

		const convertCurrency = async (inputName: string) => {
			let result = null;

			switch (inputName) {
				case INPUT_NAMES.FROM:
					result = await getConvertionResult({
						from: fromCurrency.value,
						to: toCurrency.value,
						amount: +fromCurrencyValue.value,
					});

					toCurrencyValue.value = result.toString();
					break;

				case INPUT_NAMES.TO:
					result = await getConvertionResult({
						from: toCurrency.value,
						to: fromCurrency.value,
						amount: +toCurrencyValue.value,
					});

					fromCurrencyValue.value = result.toString();
					break;
			}
		};

		const onInput = (e: Event) => {
			const name = (e.target as HTMLInputElement | HTMLSelectElement).name;
			nextTick(() => convertCurrency(name));
		};

		return {
			symbols,
			fromCurrency,
			toCurrency,
			fromCurrencyValue,
			toCurrencyValue,
			INPUT_NAMES,
			onInput,
			convertCurrency,
		};
	},
	async created() {
		const data = await CurrencyApi.getSymbols();

		if (data) {
			const keys = Object.keys(data.symbols);
			keys.forEach((key) => this.symbols.push(data.symbols[key]));
		}

		const currentLang = navigator.language;

		if (currentLang.includes(SUPPORTED_LANGS.en)) {
			this.fromCurrency = DEFAULT_CURRENCIES.USD;
			this.toCurrency = DEFAULT_CURRENCIES.EUR;
		} else if (currentLang.includes(SUPPORTED_LANGS.ru)) {
			this.fromCurrency = DEFAULT_CURRENCIES.RUB;
			this.toCurrency = DEFAULT_CURRENCIES.USD;
		}
	},
});
</script>

<style lang="scss" scoped>
@import '@/styles/_variables';

.currency-converter {
	display: flex;
	flex-wrap: wrap;
	flex-direction: column;
	gap: $gap-medium;

	padding: $gap-medium;
	border-radius: $border-radius-base;

	box-shadow: rgb(35 55 80 / 30%) 0px 6px 12px;
}

.currency-converter__container {
	display: flex;
	align-items: flex-end;
	gap: $gap-small;
}

.base-input-wrapper {
	width: 100%;
}

.base-input-title {
	display: block;
	margin-bottom: $gap-small;

	font-weight: 600;
}

.base-select,
.base-input {
	width: 100%;
	min-width: 200px;
	padding: $gap-small;
	border-radius: $border-radius-small;
	border: 1px solid rgba($color: $clr-base, $alpha: 0.6);
}

@media screen and (max-width: $tablet-width) {
	.currency-converter__container {
		flex-wrap: wrap;
	}
}
</style>
