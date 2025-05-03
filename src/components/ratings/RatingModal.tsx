
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import RatingForm from './RatingForm';
import RatingsList from './RatingsList';

interface RatingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
  adId?: string;
}

const RatingModal: React.FC<RatingModalProps> = ({ 
  open, 
  onOpenChange, 
  userId, 
  userName,
  adId 
}) => {
  const [refreshRatings, setRefreshRatings] = React.useState(0);
  
  const handleSuccess = () => {
    setRefreshRatings(prev => prev + 1);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Avaliações de {userName}</DialogTitle>
          <DialogDescription>
            Veja o que outros usuários disseram ou deixe sua própria avaliação.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <RatingForm 
            ratedUserId={userId} 
            adId={adId}
            onSuccess={handleSuccess}
          />
          
          <div className="mt-6">
            <h4 className="font-medium text-lg mb-4">Avaliações recentes</h4>
            <RatingsList userId={userId} key={refreshRatings} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RatingModal;
