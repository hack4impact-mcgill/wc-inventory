import { mockBoxes } from './mock-data';
import BoxSearch from './components/BoxSearch';

const BoxSearchByIdPage = () => {
  return (
    <BoxSearch boxes={mockBoxes}/>
  );
};

export default BoxSearchByIdPage;