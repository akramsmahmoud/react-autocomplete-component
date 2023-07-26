import "./App.css";
import { Autocomplete } from "./components";
import { getSuggestions, getSuggestionsApi } from "./utils";

function App() {
  return (
    <>
      <Autocomplete
        key="country"
        label="Country (fake async)"
        getSuggestions={getSuggestions}
      />
      <Autocomplete
        key="recipes"
        label="Recipes (with api)"
        getSuggestions={getSuggestionsApi}
      />
    </>
  );
}

export default App;
