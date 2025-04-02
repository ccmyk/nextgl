import { useBaseComponent } from './useBaseComponent';

const IntroComponent = () => {
  const { elRef } = useBaseComponent('mobile');

  return <div ref={elRef}>Intro with Base Logic</div>;
};