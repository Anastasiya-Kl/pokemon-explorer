export function formatKebabCaseLabel(value: string): string {
	const trimmedValue = value.trim();
	if (trimmedValue === "") {
		return "";
	}

	return trimmedValue
		.split("-")
		.filter((part) => part !== "")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}
