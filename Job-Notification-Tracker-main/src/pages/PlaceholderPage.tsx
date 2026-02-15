interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage = ({ title }: PlaceholderPageProps) => {
  return (
    <div className="mx-auto max-w-7xl px-system-3 py-system-5">
      <div className="max-w-prose">
        <h1 className="text-4xl text-foreground">{title}</h1>
        <p className="mt-system-2 text-base text-muted-foreground">
          This section will be built in the next step.
        </p>
      </div>
    </div>
  );
};

export default PlaceholderPage;
