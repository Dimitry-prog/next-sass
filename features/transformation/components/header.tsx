type TransformationTypeHeaderProps = {
  title: string;
  subtitle?: string;
};

const TransformationTypeHeader = ({ title, subtitle }: TransformationTypeHeaderProps) => {
  return (
    <>
      <h2 className="h2-bold text-dark-600">{title}</h2>

      {subtitle && <p className="p-16-regular mt-4">{subtitle}</p>}
    </>
  );
};

export default TransformationTypeHeader;
