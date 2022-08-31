function isNumeric(value: string) {
	return /^[+-]?\d+(\.\d+)?$/.test(value);
}

export default isNumeric;
