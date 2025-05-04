
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserListings from "./UserListings";
import UserFavorites from "./UserFavorites";

const UserProfileTabs = () => {
  return (
    <Tabs defaultValue="meus-anuncios">
      <TabsList className="mb-6">
        <TabsTrigger value="meus-anuncios">Meus Anúncios</TabsTrigger>
        <TabsTrigger value="favoritos">Favoritos</TabsTrigger>
      </TabsList>
      
      <TabsContent value="meus-anuncios">
        <UserListings />
      </TabsContent>
      
      <TabsContent value="favoritos">
        <UserFavorites />
      </TabsContent>
    </Tabs>
  );
};

export default UserProfileTabs;
