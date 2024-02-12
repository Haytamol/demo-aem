const createDateRanges = (
  startDate: string,
  endDate: string,
  contractStartDate: string
): string[] => {
  const ranges: string[] = [];
  const contractStart = new Date(contractStartDate);

  let startDay: number | null = contractStart.getDate();
  let rangeStart: Date = new Date(startDate);
  let rangeEnd: Date = new Date(startDate);

  if (typeof startDay !== "number") {
    startDay = 0;
  }

  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  while (rangeEnd < new Date(endDate)) {
    rangeEnd = new Date(
      rangeStart.getFullYear(),
      rangeStart.getMonth() + 1,
      startDay! - 1
    );

    if (rangeEnd > new Date(endDate)) {
      rangeEnd = new Date(endDate);
    }

    // Pushing to the dropdown
    const today: Date = new Date();

    if (rangeStart <= today) {
      ranges.push(
        formatter.format(rangeStart) + " - " + formatter.format(rangeEnd)
      );
    }

    rangeStart = new Date(
      rangeStart.getFullYear(),
      rangeStart.getMonth() + 1,
      startDay!
    );
  }

  return ranges;
};

export default createDateRanges;
