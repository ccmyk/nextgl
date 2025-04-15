import { About } from '@/components/webgl/About/About';
import { Background } from '@/components/webgl/Background/Background';
import { Title } from '@/components/webgl/Title/Title';
import { Footer } from '@/components/webgl/Footer/Footer';

export default function Home() {
  return (
    <main>
      <Background />
      <section className="hero">
        <Title 
          text="Eva Sánchez" 
          font="/assets/fonts/PPNeueMontreal-Medium-msdf.png"
          size={{ width: 1200, height: 300 }}
        />
      </section>
      <section className="about">
        <About 
          text="About Eva Sánchez" 
          font="/assets/fonts/PPAir-Medium-msdf.png"
          size={{ width: 800, height: 400 }}
        />
      </section>
      <Footer />
    </main>
  );
} 