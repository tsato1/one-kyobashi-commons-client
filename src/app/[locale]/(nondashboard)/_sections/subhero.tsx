import Image from "next/image"

export const Subhero = () => {
  return (
    <section id="subhero" className="w-full max-w-5xl py-20 sm:py-40">
      <h2 className="text-center text-3xl sm:text-4xl font-semibold mb-4">Welcome to ONE京橋コモンズ</h2>

      <div className="relative w-full h-[500px]">
        <Image
          src="/images/about1.png"
          alt="open_innovation"
          sizes="(max-width: 780px) 100vw, (max-width: 1280px) 70vw, 50vw"
          style={{ objectFit: "cover" }}
          priority
          fill />
      </div>
      <div className="relative w-full h-[500px]">
        <Image
          src="/images/about2.png"
          alt="nexus"
          sizes="(max-width: 780px) 100vw, (max-width: 1280px) 70vw, 50vw"
          style={{ objectFit: "cover" }}
          priority
          fill />
      </div>
      <div className="relative w-full h-[500px]">
        <Image
          src="/images/about3.png"
          alt="engagement"
          sizes="(max-width: 780px) 100vw, (max-width: 1280px) 70vw, 50vw"
          style={{ objectFit: "cover" }}
          priority
          fill />
      </div>
      <div className="relative w-full h-[500px]">
        <Image
          src="/images/about4.png"
          alt="one_to_neo"
          sizes="(max-width: 780px) 100vw, (max-width: 1280px) 70vw, 50vw"
          style={{ objectFit: "cover" }}
          priority
          fill />
      </div>

    </section>
  );
}