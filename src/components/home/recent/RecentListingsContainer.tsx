
import { Link } from "react-router-dom";
import { useRecentListings } from "./useRecentListings";
import RecentListingsGrid from "./RecentListingsGrid";

const RecentListingsContainer = () => {
  const { combinedListings, isLoading, realListings, showIllustrativeMessage } = useRecentListings();
  
  return (
    <section className="py-10 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Anúncios recentes</h2>
          <Link to="/explorar" className="text-primary font-medium hover:underline">
            Ver todos
          </Link>
        </div>

        <RecentListingsGrid
          listings={combinedListings}
          isLoading={isLoading}
          realListings={realListings}
          showIllustrativeMessage={showIllustrativeMessage}
        />
      </div>
    </section>
  );
};

export default RecentListingsContainer;
