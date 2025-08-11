import { useMemo,useContext,createContext,useState } from "react";

const LocationContext= createContext(null);
export default function LocationProvider({ children }) {
  const [location, setLocation] = useState("Pakistan");
  const value = useMemo(() => ({ location, setLocation }), [location]);

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}
export function useLocationFilter()
{
    const ctx=useContext(LocationContext)
    if(!ctx)
    {
        throw new Error('use location empty')
    }
    return ctx;
}