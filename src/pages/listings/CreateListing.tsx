
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateListingForm from "@/components/listings/CreateListingForm";
import { ensureStorageBucket } from "@/utils/storageUtils";

const CreateListing = () => {
  // Ensure the storage bucket exists when the component mounts
  useEffect(() => {
    ensureStorageBucket('ads').catch(err => {
      console.error("Failed to ensure storage bucket exists:", err);
    });
  }, []);
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Criar Anúncio</CardTitle>
            <CardDescription>
              Preencha os detalhes do seu produto ou serviço
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateListingForm />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateListing;
