const logo = "/tesca-short-logo.svg";
function SiteHeader({
  title,
  description,
  primaryActionLabel,
  primaryActionOnClick,
  secondaryActionLabel,
  secondaryActionOnClick,
}) {
  return (
    <div className="w-full ">
      {/* Top Black Nav Bar */}
      <header className="bg-[#181818] text-white w-full px-6 sm:px-10 py-5 flex items-center justify-between fixed top-0 left-0 z-50">
        {/* Logo */}
        <div className="flex items-center w-1/3  ">
          <img src={logo} alt="Tesca Group logo" />
        </div>

        {/* Hamburger */}
        <div className="flex w-1/3 justify-center">
          <button className="flex flex-col gap-[5px] p-2 hover:opacity-70 transition-opacity" aria-label="Menu">
            <span className="w-6 h-[2px] bg-white block"></span>
            <span className="w-6 h-[2px] bg-white block"></span>
            <span className="w-4 h-[2px] bg-white block"></span>
          </button>
        </div>

        {/* Languages */}
        <div className="w-1/3 flex justify-end">
          <div className="text-[11px] sm:text-xs font-semibold tracking-[0.15em] flex gap-2 items-center uppercase">
            <button className="text-white hover:opacity-70 transition-opacity">FR</button>
            <span className="text-white/30">/</span>
            <button className="text-white hover:opacity-70 transition-opacity">EN</button>
            <span className="text-white/30">/</span>
            <button className="text-white hover:opacity-70 transition-opacity">CH</button>
            <span className="text-white/30">/</span>
            <button className="text-white hover:opacity-70 transition-opacity">DE</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[#F6F4F0] px-6 py-24 sm:py-32 lg:px-8 text-center flex flex-col items-center justify-center  border-[#181818]/5">
        <h1 className="text-4xl sm:text-5xl lg:text-[2.75rem] font-bold text-[#181818] max-w-4xl leading-[1.2]">
          {title}
        </h1>
        {description && (
          <p className="mt-6 text-lg text-[#181818]/70 max-w-2xl font-medium">
            {description}
          </p>
        )}
        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          {primaryActionLabel && (
            <button
              onClick={primaryActionOnClick}
              className="bg-[#181818] text-white px-8 py-4 text-sm font-semibold transition-colors hover:bg-black"
            >
              {primaryActionLabel}
            </button>
          )}
          {secondaryActionLabel && (
            <button
              onClick={secondaryActionOnClick}
              className="bg-transparent text-[#181818] border-2 border-[#181818] px-8 py-4 text-sm font-semibold transition-colors hover:bg-[#181818] hover:text-white"
            >
              {secondaryActionLabel}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

export default SiteHeader;