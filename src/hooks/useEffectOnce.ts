import { EffectCallback, useEffect } from 'react';

function useEffectOnce(func: EffectCallback) {
  useEffect(func, []);
}

export default useEffectOnce;
