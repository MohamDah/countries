import { useState, useEffect } from "react"
import { Link, Outlet } from "react-router-dom"

export default function Layout() {
    // function getCurrentTheme() {
    //     console.log(theme)
    // }
    const sysTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    const localTheme = localStorage.getItem("theme")


    const [theme, setTheme] = useState(localTheme ? localTheme : sysTheme)

    useEffect(() => {
        localStorage.setItem("theme", `${theme}`)
    }, [theme])

    const root = document.querySelector(":root")
    root?.setAttribute("color-scheme", `${theme}`)

    function toggleTheme() {
        setTheme(prev => {
            return prev === "dark" ? "light" : "dark"
        })
    }

    return (
        <>
            <header>
                <Link className="logo-link" to="/">
                    <h1 className="logo">Where in the world?</h1>
                </Link>
                <button onClick={toggleTheme} className="dark-button">
                    {
                        theme === "light"
                            ? <i className="fa-regular fa-moon"></i>
                            : <i className="fa-solid fa-moon"></i>
                    }
                    <p>Dark Mode</p>
                </button>

            </header>

            <Outlet />
        </>
    )
}