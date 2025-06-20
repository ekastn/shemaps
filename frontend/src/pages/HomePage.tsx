import { useNavigate } from "react-router";
import { SMSearchBar } from "@/components/SMSearch/SMSearchBar";

export const HomePage = () => {
  const navigate = useNavigate();

  const handleSearchClick = () => {
    navigate('/search');
  };

  return (
    <div className="absolute bottom-6 left-4 right-4 z-10">
      <SMSearchBar 
        value=""
        onFocus={handleSearchClick} 
        readOnly={true} 
      />
    </div>
  );
};

export default HomePage;
