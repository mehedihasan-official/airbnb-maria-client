import { useState, useContext, useEffect } from "react";
import { BsSearch, BsEmojiFrown } from "react-icons/bs";
import { HiOutlineLocationMarker } from "react-icons/hi";
import ListingCard from "../../components/ListingCard/ListingCard";
import { AuthContext } from "../../provider/AuthProvider";
import Loading from "../../components/Loading";

const Listings = () => {
  const { hotelListData, hotelData, loading, user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredListings, setFilteredListings] = useState([]);

  useEffect(() => {
    if (!loading && hotelData && hotelListData) {
      const matchedData = hotelData.filter((hotel) =>
        hotelListData.some((listItem) => listItem.name === hotel.title)
      );

      const filteredData = matchedData.filter((item) => {
        const itemName = item.title ? item.title.toLowerCase() : "";
        const itemLocation = item.location ? item.location.toLowerCase() : "";
        const term = searchTerm.toLowerCase();
        return itemName.includes(term) || itemLocation.includes(term);
      });

      setFilteredListings(filteredData);
    }
  }, [hotelListData, hotelData, searchTerm, loading]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header & Search Section */}
        <div className="flex flex-col items-center mb-10 space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center">
            Find Your Next Stay
          </h1>
          
          <div className="relative w-full max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <BsSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              placeholder="Search by hotel name or location..."
              className="block w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Results Count & Content */}
        {!user ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
            <h3 className="text-xl font-semibold text-gray-700">Please log in</h3>
            <p className="text-gray-500 mt-2">You need to be signed in to view our exclusive listings.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6 px-1">
              <h2 className="text-lg font-semibold text-gray-700">
                {filteredListings.length > 0 
                  ? `${filteredListings.length} Result${filteredListings.length !== 1 ? 's' : ''} Found` 
                  : 'No Results'}
              </h2>
            </div>

            {filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredListings.map((item, index) => (
                  <div key={item.id || index} className="h-full">
                    <ListingCard item={item} index={index} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <BsEmojiFrown className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No listings found</h3>
                <p className="text-gray-500 mt-1 max-w-sm">
                  We couldn't find any matches for "{searchTerm}". Try checking your spelling or searching for a different location.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Listings;