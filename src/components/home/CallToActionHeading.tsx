
import { ShoppingCart } from "lucide-react";

const CallToActionHeading = () => {
  return (
    <>
      <div className="flex justify-center mb-6">
        <ShoppingCart size={48} />
      </div>
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Tem algo para vender ou oferecer?
      </h2>
    </>
  );
};

export default CallToActionHeading;
