export interface AutocompleteProps {
  label: string;
  onChange?: (value: string) => void;
  getSuggestions: (query: string, signal?: AbortSignal) => Promise<string[]>;
}
