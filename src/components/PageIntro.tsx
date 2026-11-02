export default function PageIntro({
  number,
  label,
  title,
  accent,
  description,
}: {
  number: string;
  label: string;
  title: string;
  accent: string;
  description: string;
}) {
  return (
    <section className="page-intro">
      <div>
        <p className="eyebrow">
          <span className="tiny-line" />
          {number} / {label}
        </p>
        <h1>
          {title}
          <br />
          <em>{accent}</em>
        </h1>
      </div>
      <p className="page-intro-description">{description}</p>
    </section>
  );
}
