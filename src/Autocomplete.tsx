import { useEffect, useState } from "react";
import { countries } from "./utils/countries";

interface AutocompleteProps {
  label: string;
}

const getAutocompleteSuggestions = (query: string): Promise<string[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredSuggestions = countries.filter((suggestion) =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      );
      resolve(filteredSuggestions);
    }, Math.random() * 1000);
  });
};

const useDebounce = (value: string, delay: number = 200) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  //useEffect hook
  useEffect(() => {
    //set timeout
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    //clear timeout
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

const resultsCache = {} as { [key: string]: string[] };

function Autocomplete(props: AutocompleteProps) {
  const [query, setQuery] = useState(""); //query = input value
  const [suggestions, setSuggestions] = useState([] as string[]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  //handle onchange autocomplete
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setQuery(value);
    setSelected(false);
  };

  useEffect(() => {
    let stop = false;

    (async () => {
      if (!debouncedQuery || debouncedQuery.length < 3) {
        setSuggestions([]);
        return;
      }
      setLoading(true);

      if (resultsCache[debouncedQuery]) {
        setSuggestions(resultsCache[debouncedQuery]);
        setLoading(false);
        return;
      }

      const filteredSuggestions = await getAutocompleteSuggestions(
        debouncedQuery
      );

      if (filteredSuggestions.length > 0) {
        resultsCache[debouncedQuery] = filteredSuggestions;
      }

      if (stop) return;

      setSuggestions(filteredSuggestions);
      setLoading(false);

      return () => {
        stop = true;
      };
    })();
  }, [debouncedQuery]);

  const highlightQuery = (suggestion: string) => {
    if (!query) return suggestion;

    const startIndex = suggestion.toLowerCase().indexOf(query.toLowerCase());

    if (startIndex === -1) return suggestion;

    const endIndex = startIndex + query.length;
    const beforeHighlight = suggestion.slice(0, startIndex);
    const highlight = suggestion.slice(startIndex, endIndex);
    const afterHighlight = suggestion.slice(endIndex);

    return (
      <>
        {beforeHighlight}
        <span style={{ fontWeight: "bold", pointerEvents: "none" }}>
          {highlight}
        </span>
        {afterHighlight}
      </>
    );
  };

  return (
    <>
      <h1>{props.label}</h1>
      <label htmlFor="autocomplete" className="inputLabel">
        Search countries
      </label>
      <div className="relative">
        <input
          type="text"
          placeholder="Search countries"
          aria-expanded={suggestions.length > 1}
          aria-autocomplete="list"
          onChange={handleOnChange}
          value={query}
          id="autocomplete"
        />
        {!loading && !selected && suggestions.length > 0 && (
          <ul className="autocomplete-results" role="listbox">
            {suggestions.map((suggestion) => (
              <li
                style={{ cursor: "pointer" }}
                className="item"
                role="option"
                key={suggestion}
                id={suggestion}
                onClick={(e) => {
                  setQuery(e.currentTarget.innerText);
                  setSelected(true);
                }}
              >
                {highlightQuery(suggestion)}
              </li>
            ))}
          </ul>
        )}
      </div>
      {loading && !selected && <div>Loading...</div>}
      {suggestions.length === 0 && !loading && query.length > 0 && (
        <div>No results found</div>
      )}
    </>
  );
}

export default Autocomplete;
