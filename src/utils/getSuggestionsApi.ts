/**
 * Mocks an API call to get autocomplete suggestions
 *
 * @param query
 * @param signal signal is an AbortSignal object instance; it is used to communicate with/abort a DOM request.
 */
const getSuggestionsApi = async (
  query: string,
  signal?: AbortSignal
): Promise<string[]> => {
  // fetch https://api.spoonacular.com/recipes/complexSearch?apiKey=01894ee9e1e64c7e8a2ccf68393d17f6&query=canne
  const response = await fetch(
    `https://api.spoonacular.com/recipes/complexSearch?apiKey=01894ee9e1e64c7e8a2ccf68393d17f6&query=${query}`,
    { signal }
  );
  const data = await response.json();
  const filteredSuggestions = data.results.map(
    (suggestion: { title: string }) => suggestion.title
  );
  return filteredSuggestions;
};

export default getSuggestionsApi;
