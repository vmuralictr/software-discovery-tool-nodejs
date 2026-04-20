import { useState, useCallback } from 'react';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import HeroSection from '../components/HeroSection';
import Carousel from '../components/Carousel/Carousel';

export default function LandingPage() {
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [showDesc, setShowDesc] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedOS, setSelectedOS] = useState({});
  const [osList, setOsList] = useState({});

  const handleResults = useCallback((pkgs, total, desc, perPage, selOS, osL) => {
    setResults(pkgs);
    setTotalCount(total);
    setShowDesc(desc);
    setItemsPerPage(perPage);
    setSelectedOS(selOS);
    setOsList(osL);
  }, []);

  const handleSearchPerformed = useCallback(() => {
    setSearched(true);
  }, []);

  return (
    <div>
      <SearchBar onResults={handleResults} onSearchPerformed={handleSearchPerformed} />
      {!searched && (
        <>
          <HeroSection />
          <Carousel />
        </>
      )}
      <SearchResults
        results={results}
        totalCount={totalCount}
        showDesc={showDesc}
        itemsPerPage={itemsPerPage}
        selectedOS={selectedOS}
        osList={osList}
      />
    </div>
  );
}
