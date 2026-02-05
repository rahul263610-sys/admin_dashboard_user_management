import Link from "next/link";

interface BreadcrumbProps {
  pageName: string;
}

const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
  return (
    <div className="breadcrumb">
      <h2 className="breadcrumb-title">{pageName}</h2>

      <nav>
        <ol className="breadcrumb-list">
          <li>
            <Link href="/dashboard">Dashboard</Link>
            <span className="breadcrumb-separator">/</span>
          </li>
          <li className="breadcrumb-current">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
