import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
interface BreadcrumbProps {
  pageName: string;
  showActions?: boolean;
  onBulkDelete?: (action: string) => void;
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
              const value= e.target.value;
              if(value==="delete" || value==="restore"){
                onBulkDelete?.(value);
                e.target.value="";
              }
            }}
            defaultValue=""
          >
            <option value="">Action</option>
                <option value="delete">Delete</option>
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
