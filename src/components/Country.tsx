import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { DetailedCountry as CountryType, DetailedCountry } from "../types"



export default function Country() {
    const [country, setCountry] = useState<CountryType | null>(null)

    const [borders, setBorders] = useState<JSX.Element[] | JSX.Element | null>(null)

    const {countryName} = useParams()

    const navigate = useNavigate()

    useEffect(() => {

        if (!country || country?.name.common !== countryName) {

            fetch(`https://restcountries.com/v3.1/name/${countryName}`)
            .then(res => {
                if (res.ok) {
                    return res.json()
                }
                throw new Error(`${res.status}`)
            })
            .then((data: CountryType[]) => setCountry(data[0]))
            .catch(() => {
                navigate("/")
            })

        }
            // This is to get the borders names after country has loaded because I need the full name of
        // the border country and I only get the abbreviated name
        async function getBorders(country: DetailedCountry) {
            const codes = country.borders
            let bs: JSX.Element[] | JSX.Element
            if (codes) {
                bs = await Promise.all(codes.map(async code => {
                    const res = await fetch(`https://restcountries.com/v3.1/alpha/${code}`)
                    const data = await res.json()
                    const border = await data[0].name.common
                    return <button
                        onClick={() => { navigate(`/${border}`);}}
                        key={border}
                        className="border"
                    >{border}</button>
                }))
            } else {
                bs = <div className="border">N/A</div>
            }
            setBorders(bs)
        }

        country && getBorders(country)
    }, [country, countryName])

    let countryEl = <h1>Loading...</h1>


    // this is to create the whole page after country api has loaded
    if (country) {
        let names = Object.values(country.name.nativeName).map((n) => n.common)
        names = [...new Set(names)]

        const currency = Object.values(country.currencies).map(cur => cur.name)

        const languages = Object.values(country.languages)


        countryEl = (
            <div className="country-details">
                <img src={country.flags.png} alt="flag" className="country-flag" />
                <div className="country-info">
                    <h1 className="country-name">{country.name.common}</h1>
                    <div className="country-stats">
                        <div className="country-stats-left">
                            <p><strong>Native Names: </strong>{names.join(", ")}</p>
                            <p><strong>Population: </strong>{country.population.toLocaleString()}</p>
                            <p><strong>Region: </strong>{country.region}</p>
                            <p><strong>Sub Region: </strong>{country.subregion}</p>
                            <p><strong>Capital: </strong>{country.capital}</p>
                        </div>
                        <div className="country-stats-right">
                            <p><strong>Top Level Domain: </strong>{country.tld.join(", ")}</p>
                            <p><strong>Currencies: </strong>{currency.join(", ")}</p>
                            <p><strong>Languages: </strong>{languages.join(", ")}</p>
                        </div>
                    </div>
                    <div className="country-borders">
                        <strong>Border Countries:</strong>
                        <div>
                            {borders ? borders : "Loading..."}
                        </div>
                    </div>
                </div>
            </div>
        )
    }



    return (
        <main className="country">
            <button onClick={()=>navigate(-1)} className="back-button">
                <i className="fa-solid fa-arrow-left-long" />
                <p>Back</p>
            </button>
            {countryEl}
        </main >
    )
}