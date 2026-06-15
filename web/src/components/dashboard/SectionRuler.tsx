export function SectionRuler({
  num,
  title,
  subtitle,
  id,
}: {
  num: string;
  title: string;
  subtitle: string;
  id?: string;
}) {
  return (
    <div className="section-ruler" id={id}>
      <span className="num">{num}</span>
      <span>{title}</span>
      <span className="line" />
      <span>{subtitle}</span>
    </div>
  );
}
