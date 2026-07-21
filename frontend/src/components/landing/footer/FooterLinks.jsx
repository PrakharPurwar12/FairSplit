import { navigationData } from '../../../data/navigationData';

export const FooterLinks = () => {
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId.replace('#', ''));
    if (element) {
      // Use standard scrollIntoView since sections no longer have scroll-mt-24 
      // wait, they do have custom programmatic scrolling on Home.jsx, 
      // but in the footer, if we just want it to scroll up, we can use the same logic
      const navbarHeight = 64; // nav height is 16 * 4 = 64px
      const y = element.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  };

  const productLinks = [
    { label: "AI Task Allocation", href: "#features" },
    { label: "Risk Prediction", href: "#features" },
    { label: "Analytics", href: "#modules" },
    { label: "Notifications", href: "#modules" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full">
      {/* Quick Links */}
      <div>
        <h3 className="font-bold text-[#111827] mb-4 text-sm tracking-wider uppercase">Quick Links</h3>
        <ul className="space-y-3">
          <li>
            <a 
              href="#home" 
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-[#6B7280] hover:text-blue-600 transition-colors text-sm"
            >
              Home
            </a>
          </li>
          {navigationData.map((item) => (
            <li key={item.id}>
              <a 
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-[#6B7280] hover:text-blue-600 transition-colors text-sm"
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a href="/dashboard" className="text-[#6B7280] hover:text-blue-600 transition-colors text-sm">
              Dashboard
            </a>
          </li>
        </ul>
      </div>

      {/* Product */}
      <div>
        <h3 className="font-bold text-[#111827] mb-4 text-sm tracking-wider uppercase">Product</h3>
        <ul className="space-y-3">
          {productLinks.map((link, idx) => (
            <li key={idx}>
              <a 
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-[#6B7280] hover:text-blue-600 transition-colors text-sm"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact */}
      <div className="col-span-2 md:col-span-1">
        <h3 className="font-bold text-[#111827] mb-4 text-sm tracking-wider uppercase">Contact</h3>
        <ul className="space-y-3 text-sm text-[#6B7280]">
          <li>
            <a href="mailto:support@fairsplit.ai" className="hover:text-blue-600 transition-colors">
              support@fairsplit.ai
            </a>
          </li>
          <li>India</li>
        </ul>
      </div>
    </div>
  );
};
