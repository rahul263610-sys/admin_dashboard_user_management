"use client"; 
import "../styles/table.css";
import Link from "next/link";
import Button from "./Button";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

interface TableProps {
  columns: string[];
  data: any[];
  actions?: ("edit" | "delete")[];
  basePath: string;
  onDelete?: (id: string) => void;
}

export default function Table({ columns, actions=[], basePath, data, onDelete }: TableProps) {

  const handleDelete = (id: string) => {
    console.log("Delete user:", id);
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>
                {col.charAt(0).toUpperCase() + col.slice(1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length >0 ? data.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td key={col}>
                  {col === "Action" ? (
                    <div className="action-buttons">
                      { actions.includes("edit") && <Link href={`/${basePath}/edit/${row._id}`}>
                          <Button
                            icon={<FiEdit2 size={16} />}
                            variant="edit"
                            />
                        </Link>
                      }

                      { actions.includes("delete") && <Button
                          icon={<FiTrash2 size={16} />}
                          variant="delete"
                          onClick={() => onDelete?.(row._id)}
                        />
                      }
                    </div>
                  ) : (
                    col ==='id' ? i + 1 : row[col]
                  )}
                </td>
              ))}
            </tr>
          )) :<tr>
                <td colSpan={columns.length} style={{ textAlign: "center" }}>
                  No user found
                </td>
          </tr>}
        </tbody>
      </table>
    </div>
  );
}
