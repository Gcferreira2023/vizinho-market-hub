
import Layout from "@/components/layout/Layout";
import ProfileCard from "@/components/user/ProfileCard";
import UserProfileTabs from "@/components/user/UserProfileTabs";

const UserProfile = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Coluna de perfil */}
          <div className="w-full md:w-1/3">
            <ProfileCard />
          </div>
          
          {/* Coluna de conteúdo */}
          <div className="w-full md:w-2/3">
            <UserProfileTabs />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
