import { Plane } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground mt-auto">
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 text-lg font-heading font-bold mb-3">
            <Plane className="h-5 w-5 text-accent" />
            TravelGo
          </div>
          <p className="text-sm opacity-80">Your trusted partner for seamless travel bookings across India.</p>
        </div>
        <div>
          <h4 className="font-heading font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li>
            <li><Link to="/hotels" className="hover:text-accent transition-colors">Hotels</Link></li>
            <li><Link to="/dashboard" className="hover:text-accent transition-colors">Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading font-semibold mb-3">Support</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><span className="cursor-pointer hover:text-accent transition-colors">Help Center</span></li>
            <li><span className="cursor-pointer hover:text-accent transition-colors">Contact Us</span></li>
            <li><span className="cursor-pointer hover:text-accent transition-colors">FAQs</span></li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li>support@travelgo.com</li>
            <li>+91 98765 43210</li>
            <li>Mumbai, India</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-secondary mt-8 pt-6 text-center text-sm opacity-60">
        © 2026 TravelGo. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
