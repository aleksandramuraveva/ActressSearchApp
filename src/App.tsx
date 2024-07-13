import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import ResultsList from './components/ResultsList';
import Loader from './components/Loader';
import ErrorButton from './components/ErrorButton';
import Pagination from './components/Pagination';
import DetailedCard from './components/DetailedCard';
import { Actress } from './types';

const App: React.FC = () => {
  const [actresses, setActresses] = useState<Actress[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 8;

  const lastCardIndex = currentPage * cardsPerPage;
  const firstCardIndex = lastCardIndex - cardsPerPage;
  const currentCards = actresses.slice(firstCardIndex, lastCardIndex);

  const [selectedActress, setSelectedActress] = useState<Actress | null>(null);
  const [isDetailedInfoLoading, setIsDetailedInfoLoading] = useState(false);

  // const isDetailedCardVisible = false;

  useEffect(() => {
    const storedSearchTerm = localStorage.getItem('searchTerm') || '';
    setSearchTerm(storedSearchTerm);
    const url = storedSearchTerm
      ? `https://freetestapi.com/api/v1/actresses?search=${storedSearchTerm}`
      : 'https://freetestapi.com/api/v1/actresses';
    fetchActresses(url);
  }, []);

  const fetchActresses = (url: string) => {
    setLoading(true);
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setActresses(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  const fetchActressDetails = (actressId: number) => {
    const url = `https://freetestapi.com/api/v1/actresses/${actressId}`;
    setIsDetailedInfoLoading(true);
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setSelectedActress(data);
        setIsDetailedInfoLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
        setIsDetailedInfoLoading(false);
      });
  };

  const handleSearch = (newSearchTerm: string) => {
    localStorage.setItem('searchTerm', newSearchTerm);
    setSearchTerm(newSearchTerm);
    setCurrentPage(1);
    const specificActressUrl = `https://freetestapi.com/api/v1/actresses?search=${newSearchTerm}`;
    fetchActresses(specificActressUrl);
  };

  const handleCardClick = (actress: Actress) => {
    fetchActressDetails(actress.id);
  };

  const handleError = () => {
    setHasError(true);
  };

  if (hasError) {
    throw new Error('Well you crashed me!=)');
  }

  return (
    <>
      <main onClick={() => setSelectedActress(null)}>
        <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />
        <ErrorButton onError={handleError} />
        <Pagination
          totalCards={actresses.length}
          cardsPerPage={cardsPerPage}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
        {loading ? (
          <Loader />
        ) : (
          <ResultsList
            actresses={currentCards}
            handleCardClick={handleCardClick}
          />
        )}
      </main>
      {isDetailedInfoLoading ? (
        <Loader />
      ) : (
        selectedActress && (
          <DetailedCard
            actress={selectedActress}
            setSelectedActress={setSelectedActress}
          />
        )
      )}
    </>
  );
};

export default App;
