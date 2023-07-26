import { countries } from ".";

/**
 * Mocks an API call to get autocomplete suggestions
 *
 * @param query
 * @param signal signal is an AbortSignal object instance; it is used to communicate with/abort a DOM request.
 */
const getAutocompleteSuggestions = (
  query: string,
  signal: AbortSignal
): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (signal?.aborted) {
        reject(signal.reason);
      }
      const filteredSuggestions = countries.filter((suggestion) =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      );
      resolve(filteredSuggestions);
    }, Math.random() * 1000);
  });
};

export default getAutocompleteSuggestions;
