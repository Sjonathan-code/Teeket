interface PageHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function PageHeading({ eyebrow, title, description }: PageHeadingProps): React.ReactElement {
  return (
    <header>
      <p className="text-xs font-semibold uppercase tracking-widest text-signal">{eyebrow}</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
    </header>
  );
}
