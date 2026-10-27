import { useState } from "react";
import Header from "./components/Header";
import Modal from "./components/Modal";
import Explorer from "./sections/Explorer";
import { useTravelData } from "./hooks/useTravelData";
import type { Destination } from "./types/travel";

export default function App() {
  const { data, error, retry } = useTravelData();
  const [destination, setDestination] = useState<Destination | null>(null);
  return (
    <>
      <a className="skip-link" href="#main">Lewati navigasi</a>
      <Header />
      <main id="main">
        {!data && !error && <div className="loading-state" role="status">Menyiapkan perjalananmu…</div>}
        {error && <div className="error-state" role="alert"><h1>Katalog belum bisa dimuat.</h1><p>{error}</p><button className="btn red" onClick={retry}>Coba lagi</button></div>}
        {data && <Explorer data={data} onDetail={setDestination} />}
      </main>
      {destination && <Modal title={destination.name} onClose={() => setDestination(null)}>
        <img className="modal-photo" src={destination.image} alt={destination.imageAlt} />
        <p>{destination.description}</p>
        <p className="muted">Inspirasi destinasi prototype. Foto ilustrasi. Informasi perjalanan perlu dikonfirmasi.</p>
      </Modal>}
    </>
  );
}
