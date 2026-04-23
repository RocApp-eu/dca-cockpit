export function SectionRuler({
  num,
  title,
  subtitle,
}: {
  num: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="section-ruler">
      <span className="num">{num}</span>
      <span>{title}</span>
      <span className="line" />
      <span>{subtitle}</span>
    </div>
  );
}
