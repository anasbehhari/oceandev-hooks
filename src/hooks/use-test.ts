import { useEffect, useState } from 'react';

function useTest() {
  if (true) {
    const [as, salls] = useState(true);
    useEffect(() => {
      console.log('test');
    }, []);
  }
}

export default useTest;
