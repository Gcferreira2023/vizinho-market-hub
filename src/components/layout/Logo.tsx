
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="bg-primary p-1 rounded">
        <ShoppingCart size={24} className="text-white" />
      </div>
      <span className="text-xl font-bold text-primary hidden md:block">
        VizinhoMarket
      </span>
    </Link>
  );
};

export default Logo;
