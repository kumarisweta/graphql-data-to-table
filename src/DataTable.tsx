import React, { useEffect, useState } from 'react';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import './App.css';

interface TableProps {
    data: { name: string; code: string;}[];
}

const client = new ApolloClient({
        uri: 'https://countries.trevorblades.com/',
        cache: new InMemoryCache(),
    });
    
    // Define your GraphQL query
    const GET_DATA = gql`
            query {
                    countries {
                            name
                            code
                    }
            }
    `;

const DataTable: React.FC<TableProps> = ({ data }) => {
    const [countries, setCountries] = useState([]);
    const [filterd_countires, setFilteredCountries] = useState([]);
    const [counter, setCounter] = useState(0);
    const [countries_to_show, setCountriesToShow] = useState([]);

    useEffect(() => {
        client.query({
            query: GET_DATA,
        })
            .then(response => {
                // Handle the GraphQL response here
                setCountries(response.data.countries);
                setFilteredCountries(response.data.countries);
            })
            .catch(error => {
                // Handle errors here
                console.error(error);
            });
    }, []);

    useEffect(() => {
        setCountriesToShow(filterd_countires.slice(counter, counter+15));
    }, [counter, filterd_countires]);

    const handlePrevious = (): void => {
        setCounter(counter - 15);
        setCountriesToShow(filterd_countires.slice(counter-15, counter));
    }
    
    const handleNext = (): void => {
        setCounter(counter + 15);
        setCountriesToShow(filterd_countires.slice(counter+15, counter+30));
    }

    const handleSearch = (event: React.FormEvent<HTMLInputElement>): void => {
        const { value } = event.currentTarget;
        setCounter(0);
        const filtered_countries = countries.filter((country: { name: string; code: string }) => country.code.toLowerCase().includes(value.toLowerCase()));
        setCountriesToShow(filtered_countries);
        setCountriesToShow(filtered_countries.slice(0, 15));
    }

    return (
        <div className='centerAlignment'>
            <h1>Country List</h1>
            <input type="text" name="search" onChange={handleSearch} placeholder='
            Search by country code'/>
        <table className='center'>
            <thead>
                <tr>
                    <th>Country Name</th>
                    <th>Code</th>
                </tr>
            </thead>
            <tbody>
                {countries_to_show.map((country: { name: string; code: string }, index: number) => (
                    <tr key={index}>
                        <td>{country.name}</td>
                        <td>{country.code}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        <button type="button" className="previous center" onClick={handlePrevious} disabled={!counter}>&laquo; Previous</button>
        <button type="button" className="next center" onClick={handleNext}>Next &raquo;</button>
        </div>
    );
};

export default DataTable;