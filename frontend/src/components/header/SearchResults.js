// // SearchResults.js
// import React from 'react';
// import CardComponent from '../card/card'; // Import your CardComponent

// const SearchResults = ({ results }) => {
//   return (
//     <div>
//       {results.map((solarPanel) => (
//         <CardComponent key={solarPanel.id} cardData={solarPanel} />
//       ))}
//     </div>
//   );
// };

// export default SearchResults;

import React, { useState, useEffect, useRef } from 'react';
import CardComponent from '../card/card';
import { Grid, Typography, useTheme, useMediaQuery, Pagination } from '@mui/material';
import { styled } from '@mui/system';

const SearchResultsContainer = styled('div')({
  marginTop: theme => theme.spacing(2),
  textAlign: 'center',
});

const PaginationContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme => theme.spacing(2),
  });

const itemsPerPage = 8;

const SearchResults = ({ results }) => {
    const theme = useTheme();
    const isSmallerScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [currentPage, setCurrentPage] = useState(1);

    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollIntoView({ behavior: 'smooth' });
          }
    }, [currentPage]);

    const handleChangePage = (event, value) => {
        setCurrentPage(value);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentResults = results.slice(startIndex, endIndex);

    return (
        <SearchResultsContainer style={{marginTop: 50}} ref={containerRef}>
            <Typography variant={isSmallerScreen ? 'h5' : 'h4'} gutterBottom style={{ textAlign: 'center', fontWeight: 'bold' }}>
            Search Results ({results.length} {results.length === 1 ? 'result' : 'results'})
            </Typography>
            <Grid container spacing={2}>
            {currentResults.map((solarPanel) => (
                <Grid item key={solarPanel.id} xs={12} sm={6} md={4} lg={3}>
                <CardComponent cardData={solarPanel} />
                </Grid>
            ))}
            </Grid>
            <PaginationContainer>
                <Pagination
                count={Math.ceil(results.length / itemsPerPage)}
                page={currentPage}
                onChange={handleChangePage}
                />
            </PaginationContainer>
            <Typography variant={isSmallerScreen ? 'h5' : 'h4'} gutterBottom style={{ textAlign: 'center', fontWeight: 'bold' }}>
            End of Search Results
            {/* End of Search Results ({results.length} {results.length === 1 ? 'result' : 'results'}) */}
            </Typography>
        </SearchResultsContainer>
    );
};

export default SearchResults;
