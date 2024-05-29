export const executeJobsIfMatched = async <T>(params: {
  jobs: Array<{
    match: boolean;
    do: () => Promise<T>;
  }>;
  returnOnFirstMatch?: boolean;
}) => {
  const { jobs, returnOnFirstMatch = true } = params;
  const results: T[] = [];

  for (const job of jobs) {
    if (job.match) {
      const result = await job.do();
      results.push(result);

      if (returnOnFirstMatch) break;
    }
  }

  return results;
};

export const findFirstMatch = <T>(
  items: Array<{ match: boolean; value: T }>,
) => {
  for (const item of items) {
    if (item.match) {
      return item.value;
    }
  }

  return undefined;
};
