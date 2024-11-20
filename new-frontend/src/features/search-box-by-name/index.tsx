import { useEffect, useState } from 'react';
import { fetchBoxes } from '@/lib/api';
import BoxSearch from './components/BoxSearch';
import { Box } from '@/types/box';

const BoxSearchByNamePage = () => {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBoxes = async () => {
      try {
        const fetchedBoxes = await fetchBoxes();
        setBoxes(fetchedBoxes);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadBoxes();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <BoxSearch boxes={boxes} />;

};

export default BoxSearchByNamePage;