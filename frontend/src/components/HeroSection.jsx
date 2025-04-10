const HeroSection = () => {
    return (
        <section className="relative bg-gradient-to-r from-blue-600 to-blue-400 text-white lg:py-20 sm:py-16 py-12 px-6 text-center">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-5xl font-extrabold leading-tight tracking-tight drop-shadow-lg">
                    Saylani Microfinance – Empowering Your Future
                </h1>
                <p className="mt-4 text-xl text-white/90 max-w-2xl mx-auto">
                    Interest-free loans for your wedding, home construction, business startup, and education. Apply today and build your dream future.
                </p>
                <a
                    href="#loan-categories"
                    className="mt-8 inline-block bg-white text-blue-600 font-semibold text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                    Explore Loan Options
                </a>
            </div>
        </section>
    )
}

export default HeroSection