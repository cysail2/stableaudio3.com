const DEFAULT_SCHEMA_TIME_ZONE = "America/New_York";

export function toSchemaDateTime(value: string, timeZone = DEFAULT_SCHEMA_TIME_ZONE): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return `${value}T00:00:00${getTimeZoneOffset(value, timeZone)}`;
  }

  return value;
}

function getTimeZoneOffset(date: string, timeZone: string): string {
  const offsetName = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "shortOffset",
  })
    .formatToParts(new Date(`${date}T12:00:00Z`))
    .find((part) => part.type === "timeZoneName")?.value;

  const match = offsetName?.match(/^GMT([+-])(\d{1,2})(?::(\d{2}))?$/);
  if (!match) {
    return "Z";
  }

  const [, sign, hours, minutes = "00"] = match;
  return `${sign}${hours.padStart(2, "0")}:${minutes}`;
}
