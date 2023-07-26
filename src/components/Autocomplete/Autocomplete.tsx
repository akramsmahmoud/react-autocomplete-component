import { useEffect, useRef, useState } from "react";
import { useDebounce } from "../../utils";
import "./Autocomplete.css";
import { AutocompleteProps } from "./Autocomplete.types";

/**
 * Cache results to avoid making the same request multiple times
 */
const resultsCache = {} as { [key: string]: string[] };

/**
 *
 * @param props AutocompleteProps
 * @param props.label label for input
 * @param props.onChange onChange event handler
 * @param props.getSuggestions getSuggestions function returns a promise of string[]
 * @returns
 */
function Autocomplete({
  label,
  onChange,
  getSuggestions,
  ...props
}: AutocompleteProps) {
  const [query, setQuery] = useState(""); //query = input value
  const [suggestions, setSuggestions] = useState([] as string[]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const abortController = new AbortController();

  const suggestionsRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  //handle onchange autocomplete
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setQuery(value);
    setSelected(false);
    onChange && onChange(value);
  };

  // handle input keydown
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      //focus on first item in list
      const firstSuggestion = suggestionsRef.current?.firstChild as HTMLElement;
      firstSuggestion?.focus();
    }
  };

  // handle item keydown
  const handleItemKeyDown = (
    e: React.KeyboardEvent<HTMLLIElement>,
    suggestion: string
  ) => {
    if (e.key === "Enter") {
      setQuery(suggestion);
      setSelected(true);
      inputRef.current?.focus();
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextSibling = e.currentTarget.nextSibling as HTMLElement;
      nextSibling?.focus();
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevSibling = e.currentTarget.previousSibling as HTMLElement;
      prevSibling?.focus();
    }
  };

  useEffect(() => {
    const { signal } = abortController;

    (async () => {
      if (!debouncedQuery) {
        setSuggestions([]);
        return;
      }
      setLoading(true);

      if (resultsCache[debouncedQuery]) {
        setSuggestions(resultsCache[debouncedQuery]);
        setLoading(false);
        return;
      }

      const filteredSuggestions = await getSuggestions(debouncedQuery, signal);

      // cache new results
      if (filteredSuggestions.length > 0) {
        resultsCache[debouncedQuery] = filteredSuggestions;
      }

      setSuggestions(filteredSuggestions);
      setLoading(false);

      return () => {
        abortController?.abort("Cancelled due to new request");
      };
    })();
  }, [debouncedQuery]);

  // highlight query in suggestion
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
      {suggestions.length > 1 && (
        <div className="suggestions-help sr-only" role="status">
          There are {suggestions.length} suggestions. Use the up and down arrows
          to browse.
        </div>
      )}
      <label htmlFor="autocomplete" className="inputLabel">
        {label}
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
          autoComplete="off"
          ref={inputRef}
          onKeyDown={handleInputKeyDown}
          {...props}
        />
        {!loading && !selected && suggestions.length > 0 && (
          <ul
            className="autocomplete-results"
            role="listbox"
            aria-label="Suggestions"
            aria-activedescendant={suggestions[0]}
            aria-expanded={suggestions.length > 1}
            tabIndex={-1}
            ref={suggestionsRef}
          >
            {suggestions.map((suggestion) => (
              <li
                style={{ cursor: "pointer" }}
                className="suggestion-item"
                role="option"
                key={suggestion}
                id={suggestion}
                onKeyDown={(e) => handleItemKeyDown(e, suggestion)}
                tabIndex={-1}
                onClick={() => {
                  setQuery(suggestion);
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
        <div role="status" className="empty-status">
          No results found
          <span className="sr-only">
            , you may need to type new characters for better results
          </span>
        </div>
      )}
    </>
  );
}

export default Autocomplete;
