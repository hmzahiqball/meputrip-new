import { useState, type FormEvent } from "react";
import { ArrowUpRight, Copy, Check, Send } from "lucide-react";
import Modal from "./Modal";
export default function Inquiry({
  initial,
  number,
  onClose,
}: {
  initial: string;
  number: string;
  onClose: () => void;
}) {
  const [message, setMessage] = useState(""),
    [copied, setCopied] = useState(false);
  const validNumber = /^[1-9]\d{7,14}$/.test(number);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setMessage(
      `Halo Meputrip, saya ${String(data.get("name"))}. Saya ingin konsultasi ${String(data.get("destination"))} untuk ${String(data.get("people"))} orang, rencana ${String(data.get("date"))}. Catatan: ${String(data.get("notes")) || "-"}. Mohon informasi itinerary, biaya, dan ketersediaan.`,
    );
  }
  return (
    <Modal title="Perjalananmu, caramu." onClose={onClose}>
      <p className="muted">
        Ceritakan rencanamu. Susun pesan konsultasi untuk tim Meputrip.
      </p>
      <form className="inquiry-form" onSubmit={submit}>
        <label>
          Nama
          <input
            name="name"
            required
            maxLength={80}
            placeholder="Nama Anda"
            autoComplete="name"
          />
        </label>
        <label>
          Tujuan perjalanan
          <input
            name="destination"
            required
            defaultValue={initial}
            placeholder="Misalnya: Ubud, Bali"
            maxLength={150}
          />
        </label>
        <div className="form-row">
          <label>
            Jumlah peserta
            <input
              name="people"
              type="number"
              min="1"
              max="100"
              defaultValue="2"
              required
            />
          </label>
          <label>
            Rencana keberangkatan
            <input name="date" type="month" required />
          </label>
        </div>
        <label>
          Catatan
          <textarea
            name="notes"
            placeholder="Durasi, preferensi, atau kebutuhan khusus"
            maxLength={1000}
          />
        </label>
        <button className="btn red" type="submit">
          Susun pesan konsultasi <Send size={16} />
        </button>
      </form>
      {message && (
        <div className="message-preview" role="status">
          <strong>
            {validNumber
              ? "Pesan siap dikirim"
              : "Mode demo — kontak WhatsApp belum diatur"}
          </strong>
          <p>{message}</p>
          {validNumber ? (
            <a
              className="btn olive-btn"
              href={`https://wa.me/${number}?text=${encodeURIComponent(message)}`}
              target="_blank"
              rel="noreferrer"
            >
              Buka WhatsApp <ArrowUpRight size={16} />
            </a>
          ) : (
            <button
              className="btn outline-dark"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(message);
                  setCopied(true);
                } catch {
                  setCopied(false);
                }
              }}
            >
              {copied ? "Pesan disalin" : "Salin pesan"}{" "}
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          )}
          <small>
            Formulir ini tidak menyimpan atau mengirim data.{" "}
            {validNumber
              ? "Pengiriman dilakukan sendiri melalui WhatsApp."
              : "Anda dapat menyalin pesan sebagai demo."}
          </small>
        </div>
      )}
    </Modal>
  );
}
