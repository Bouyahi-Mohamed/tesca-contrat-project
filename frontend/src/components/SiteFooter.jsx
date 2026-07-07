
import logo from "../../dist/assets/images/tesca-short-logo.svg";
function SiteFooter() {
  return (
    <footer id="footer" role="contentinfo" className="bg-[#181818] text-white w-full px-6 py-12 sm:px-10 lg:px-12 mt-12 border-t border-[#181818]/10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
          <div className="flex items-center" itemScope itemType="http://schema.org/logo">
            <a itemProp="url" href="https://www.tescagroup.com/" aria-label="Tesca Group home">
              <img src={logo} alt="Tesca Group logo" />
            </a>
          </div>

          <div className="space-y-1 text-sm font-medium leading-6 text-white" itemProp="address" itemScope itemType="http://schema.org/PostalAddress">
            <p>Tour Pacific</p>
            <p>11 cours Valmy</p>
            <p>92977 Paris la Défense</p>
          </div>
        </div>

        <div className="flex items-center gap-6" itemScope itemType="http://schema.org/SocialMediaPosting">
          <a
            itemProp="url"
            className="text-lg font-bold text-white transition hover:opacity-70"
            href="https://www.tescagroup.com/suppliers/"
          >
            Fournisseurs
          </a>
          <a
            itemProp="url"
            href="https://www.linkedin.com/company/tesca-tescagroup/"
            target="_blank"
            rel="noreferrer"
            aria-label="Tesca Group on LinkedIn"
            className="text-white transition hover:opacity-70 font-bold text-lg"
          >
            in
          </a>
        </div>
      </div>
      <div className="mx-auto mt-8 w-full max-w-7xl text-sm text-white sm:flex sm:items-center sm:justify-center">
              © TESCA 2026 / Mentions légales-Données personnelles

      </div>

    </footer>
  );
}

export default SiteFooter;