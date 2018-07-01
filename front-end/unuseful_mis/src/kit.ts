export function c<T>(obj: T): T {
	return JSON.parse(JSON.stringify(obj));
}
