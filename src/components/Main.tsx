import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom";
import { Country } from "../types";
Link
// import downArrow from "../assets/downArrow.svg"


export default function Main() {
    const [countryData, setCountryData]: [Country[] | [], any] = useState([])

    const [input, setInput] = useState("")

    const [searchParams, setSearchParams] = useSearchParams();


    useEffect(() => {
        fetch("https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital")
            .then(res => res.json())
            .then((data: Country[]) => {
                data.sort((a, b) => {
                    if (a.name.common < b.name.common) {
                        return -1;
                    }
                    if (a.name.common > b.name.common) {
                        return 1;
                    }
                    return 0;
                })
                setCountryData(data)
            })
    }, [])


    let countryEls: [] | (JSX.Element | undefined)[] = []

    if (countryData.length !== 0) {
        countryEls = countryData.map((country: Country) => {
            let allow = true
            if (searchParams.get("region") && searchParams.get("region") !== country.region) {
                allow = false
            }

            if (input !== "" && !country.name.common.toLowerCase().includes((input.toLowerCase()))) {
                allow = false
            }

            if (allow) {
                return (
                    <Link to={country.name.common} className="card" key={country.name.common}>
                        <img src={country.flags.png} alt="flag" />
                        <div>
                            <h2>{country.name.common}</h2>
                            <p><strong>Population: </strong>{(country.population).toLocaleString()}</p>
                            <p><strong>Region: </strong>{country.region}</p>
                            <p><strong>Capital: </strong>{country.capital}</p>
                        </div>
                    </Link>
                )
            }
        })
    }

    function handleFilter(e: React.ChangeEvent<HTMLSelectElement>) {
        if (!e.target.value) {
            setSearchParams({})
        } else {
            setSearchParams({ region: e.target.value })
        }
    }

    return (
        <main className="home">
            <div className="home_header">
                <div className="search-container">
                    <i className="fa-solid fa-magnifying-glass" />
                    <input
                        name="search"
                        type="text"
                        placeholder="Search for a country..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                    />

                </div>
                <select onChange={handleFilter} name="filter"
                    defaultValue={searchParams.get("region") || `Filter By Region`}>
                    <option hidden disabled value="Filter By Region">Filter By Region</option>
                    <option value="">All</option>
                    <option value="Africa">Africa</option>
                    <option value="Americas">America</option>
                    <option value="Asia">Asia</option>
                    <option value="Europe">Europe</option>
                    <option value="Oceania">Oceania</option>
                    <option value="Antarctic">Antarctic</option>
                </select>
            </div>
            <div className="home_body">
                {countryEls.length !== 0 && countryEls}
            </div>
        </main>
    )
}