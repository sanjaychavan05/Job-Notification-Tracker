interface ContextHeaderProps {
  headline: string;
  subtext: string;
}

const ContextHeader = ({ headline, subtext }: ContextHeaderProps) => {
  return (
    <section className="border-b border-border px-system-4 py-system-4">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground font-serif">
        {headline}
      </h1>
      <p className="mt-system-1 max-w-prose text-base text-muted-foreground">
        {subtext}
      </p>
    </section>
  );
};

export default ContextHeader;
