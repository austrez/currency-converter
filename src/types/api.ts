type TSymbol = {
	description: string; // E.g United States Dollar
	code: string; // E.g USD
};

type TSymbols = {
	[key: string]: TSymbol;
};

type TGetSymbolsData = {
	success: true;
	symbols: TSymbols;
};

type TGetSymbolsQuery = {
	from: string;
	to: string;
	amount: number;
};

type TConvertCyrrencyData = {
	date: string;
	historical: false;
	info: {
		rate: number;
	};
	query: TGetSymbolsQuery;
	result: number;
	success: true;
};

export type {
	TSymbols,
	TSymbol,
	TGetSymbolsData,
	TGetSymbolsQuery,
	TConvertCyrrencyData,
};
