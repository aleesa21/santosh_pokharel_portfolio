import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { getPersonalDetails } from "../supabase/details";
const PersonalDetailsContext = createContext(null);

export function PersonalDetailsProvider({ children }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setDetails(await getPersonalDetails());
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return (
    <PersonalDetailsContext.Provider
      value={{ details, loading, error, refetch: fetchDetails }}
    >
      {children}
    </PersonalDetailsContext.Provider>
  );
}

export const usePersonalDetails = () => useContext(PersonalDetailsContext);
