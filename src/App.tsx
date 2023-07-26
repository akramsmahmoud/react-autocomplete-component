import "./App.css";
import { Autocomplete } from "./components";
import { getSuggestions, getSuggestionsApi } from "./utils";

function App() {
  return (
    <>
      <div className="height-1-2vh">
        <Autocomplete
          key="country"
          label="Country (fake async)"
          getSuggestions={getSuggestions}
        />
      </div>
      <div className="height-1-2vh">
        <Autocomplete
          key="recipes"
          label="Recipes (with api)"
          getSuggestions={getSuggestionsApi}
        />
      </div>
    </>
  );
}

export default App;
