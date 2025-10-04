import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import searchIcon from "../assets/images/search.png";
import "./Search.css";

function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    // Navigate to a SearchResults page with query as a URL param
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form className="search-form" onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="submit-button" type="submit">
        <img src={searchIcon} alt="Search" />
      </button>
    </form>
  );
}

export default SearchBar;