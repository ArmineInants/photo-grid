import React from 'react';
import styled from 'styled-components';

const SearchContainer = styled.div`
  padding: 1rem;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
`;

const SearchForm = styled.form`
  display: flex;
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  height: 36px;
  width: 70%;
  
  &:focus {
    outline: none;
  }
`;

const SearchButton = styled.button`
  padding: 0.5rem 1rem;
  background: #000000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  height: 36px;
  width: 30%;
  
  &:hover {
    opacity: 0.8;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  defaultQuery: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading, defaultQuery }) => {
  const [query, setQuery] = React.useState(defaultQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query);
  };

  return (
    <SearchContainer>
      <SearchForm onSubmit={handleSubmit}>
        <SearchInput
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search photos..."
          disabled={isLoading}
        />
        <SearchButton type="submit" disabled={isLoading}>
          Search
        </SearchButton>
      </SearchForm>
    </SearchContainer>
  );
};
