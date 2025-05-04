
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ListingDetailView from "@/components/listings/detail/ListingDetailView";
import ListingDataFetcher from "@/components/listings/detail/ListingDataFetcher";

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <Layout>
      <ListingDataFetcher id={id}>
        {({ listing, displayListing, listingImages, listingStatus, isLoading, handleStatusChange, viewCount }) => {
          if (isLoading) {
            return <LoadingSpinner message="Carregando anúncio..." />;
          }

          return (
            <ListingDetailView 
              listing={listing}
              displayListing={displayListing}
              listingImages={listingImages}
              listingStatus={listingStatus}
              id={id}
              handleStatusChange={handleStatusChange}
              viewCount={viewCount}
            />
          );
        }}
      </ListingDataFetcher>
    </Layout>
  );
};

export default ListingDetail;
