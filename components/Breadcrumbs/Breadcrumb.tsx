import Link from "next/link";
interface BreadcrumbProps {
  pageName: string;
  showActions?: boolean;
  onBulkDelete?: () => void;
}

const Breadcrumb = ({ pageName, showActions, onBulkDelete }: BreadcrumbProps) => {
  return (
    <div className="breadcrumb">
      <div className="breadcrumb-left">
      <h2 className="breadcrumb-title">{pageName}</h2>
      {
        showActions &&
          <select
          className="filter-select"
            onChange={(e)=>{
              if(e.target.value==="bulk-delete"){
                onBulkDelete?.();
                e.target.value="";
              }
            }}
            defaultValue=""
          >
            <option value="">Action</option>
            <option value="bulk-delete">Bulk Delete</option>
          </select>
      }
      </div>
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
