import { assetUrl } from "../utils/assetUrl";
import Reveal from "../components/Reveal";
import {
  ArrowUpRight,
  Route,
  Leaf,
  Users,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import type { TravelData } from "../types/travel";
import { photos } from "../data/mock";
import PageIntro from "../components/PageIntro";
export default function ProfilePage({ data }: { data: TravelData }) {
  const advantages = [
    {
      icon: Route,
      title: "Rute mengikuti ritmemu",
      text: "Draft layanan: itinerary fleksibel sesuai waktu dan preferensi perjalanan.",
    },
    {
      icon: Users,
      title: "Teman di perjalanan",
      text: "Draft layanan: pendamping dan koordinasi perjalanan sesuai paket.",
    },
    {
      icon: MessageCircle,
      title: "Mulai dari percakapan",
      text: "Draft layanan: konsultasikan tujuan, kebutuhan, dan anggaran lebih awal.",
    },
    {
      icon: ShieldCheck,
      title: "Informasi yang terbuka",
      text: "Draft layanan: detail biaya dan fasilitas dikonfirmasi sebelum pemesanan.",
    },
  ];
  return (
    <>
      <PageIntro
        number="02"
        label="PROFIL MEPU"
        title="Kenali teman"
        accent="perjalananmu."
        description="Lebih dekat dengan Mepu, cerita di balik perjalanan, dan cara kami menjelajahi Indonesia."
      />
      <section className="section about" id="tentang">
        <Reveal className="about-image">
          <img
            src={assetUrl(photos.bali)}
            alt="Foto ilustrasi suasana alam Bali"
            loading="lazy"
          />
          <span className="photo-caption">A LITTLE CLOSER TO INDONESIA.</span>
        </Reveal>
        <Reveal className="about-copy">
          <p className="eyebrow olive">KENAL LEBIH DEKAT / DRAFT PROFIL</p>
          <h2>
            Perjalanan baik
            <br />
            dimulai dengan
            <br />
            <em>rasa ingin tahu.</em>
          </h2>
          <p>{data.company.story}</p>
          <div className="vision-mission">
            <div>
              <h3>Visi kami</h3>
              <p>{data.company.vision}</p>
            </div>
            <div>
              <h3>Misi kami</h3>
              <p>{data.company.mission}</p>
            </div>
          </div>
          <a className="text-link" href="#/profil-mepu/kontak">
            Mari berkenalan <ArrowUpRight size={15} />
          </a>
        </Reveal>
      </section>
      <section className="section values">
        <Reveal className="section-heading">
          <div>
            <p className="eyebrow olive">THE WAY WE TRAVEL / DRAFT LAYANAN</p>
            <h2>
              Detail kecil.
              <br />
              Pengalaman berarti.
            </h2>
          </div>
          <Leaf size={44} strokeWidth={1} />
        </Reveal>
        <div className="values-grid">
          {advantages.map((v) => (
            <Reveal as="article" key={v.title}>
              <v.icon size={26} strokeWidth={1.3} />
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <Reveal as="section" className="section legal" id="legalitas">
        <div>
          <p className="eyebrow olive">COMPANY INFORMATION</p>
          <h2>Kenali perusahaanmu.</h2>
          <p>
            Dokumen legal dan identitas perusahaan akan ditampilkan setelah
            diberikan dan diverifikasi oleh pemilik.
          </p>
        </div>
        <div>
          {data.legal.map((doc) => (
            <Reveal as="article" key={doc.id}>
              <ShieldCheck size={22} />
              <div>
                <h3>{doc.title}</h3>
                <p>{doc.status}</p>
                {/^https:\/\//.test(doc.url) && (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-link"
                  >
                    Lihat dokumen <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </Reveal>
    </>
  );
}
