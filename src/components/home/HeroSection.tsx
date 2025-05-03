
import HeroHeading from "./HeroHeading";
import HeroButtons from "./HeroButtons";
import HeroImage from "./HeroImage";

const HeroSection = () => {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-primary/10 to-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <HeroHeading />
            <HeroButtons />
          </div>
          <HeroImage />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
