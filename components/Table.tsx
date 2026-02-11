"use client"; 
import { useState, useEffect } from "react";
import "../styles/table.css";
import Link from "next/link";
import Button from "./Button";
import { FiEdit2, FiTrash2, FiEye, FiRotateCcw   } from "react-icons/fi";
import { Modal, Button as BootstrapButton } from "react-bootstrap";
import { User } from "./types/user";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Checkbox from "./CheckBox";


interface TableProps {
  columns: string[];
  rows: string[];
  modal_header: string[];
  data: any[];
  actions?: ("edit" | "delete" | "view" | "restore")[];
  basePath: string;
  modal_title: string;
  onDelete?: (id: string , action: string) => void;
  isCheckBox?: boolean;
  selectedIds?: string[];
  setSelectedIds?: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function Table({ columns,rows,  actions=[], basePath, data, onDelete, modal_header=[], modal_title="", isCheckBox=false, selectedIds=[], setSelectedIds }: TableProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);

  const {user, loading, error} = useSelector((state :  RootState)=> state.auth)

  const handleOpen = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleClose = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  const allSelected = data.length> 0 && selectedIds.length === data.length;
  const toggleAll = (checked: boolean) => {
    if (!setSelectedIds) return;
    setSelectedIds(checked ? data.map((d: any) => d._id) : []);
  };


  const toggleOne = (id: string, checked: boolean) => {
    if (!setSelectedIds) return;
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id)
    );
  };

  const getValue = (data: User, col: string, i: number=0) => {
    switch (col) {
      case "srno":
        return i + 1 ;
      case "status":
        return data.status === "1" ? "Active" : "Inactive";
      case "created By":
        return data.user?.name || "N/A";
      default:
        return (data as Record<string, any>)[col] || "N/A";
    }
  };
  return (
    <>
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {isCheckBox && user?.role==="admin"  && (<th data-column="checkbox"><Checkbox checked ={allSelected} onChange={toggleAll}/></th>)}
            {columns.map((col) => (
              <th key={col} data-column={col}>
                {col.charAt(0).toUpperCase() + col.slice(1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          
          {data.length >0 ? data.map((row, i) => (
            <tr key={i}>
              {isCheckBox && user?.role==="admin" && (
                <td data-column="checkbox">
                  <Checkbox
                    checked={selectedIds.includes(row._id)}
                    onChange={(checked) =>
                      toggleOne(row._id, checked)
                    }
                  />
                </td>
              )}
              {rows.map((col) => (
                <td key={col}  data-column={col}>
                  {col === "Action" ? (
                    <div className="action-buttons">
                      {actions.includes("view") && (
                        <Button icon={<FiEye size={16} />} variant="view" onClick={() => handleOpen(row)} />
                      )}
                      {(user?.role==="admin" || user?._id ===row?.user?._id ) && actions.includes("edit") && <Link href={`/${basePath}/edit/${row._id}`}>
                        <Button
                          icon={<FiEdit2 size={16} />}
                          variant="edit"
                          />
                        </Link>
                      }
                      {(user?.role==="admin" || user?._id ===row?.user?._id ) && actions.includes("delete") && <Button
                          icon={<FiTrash2 size={16} />}
                          variant="delete"
                          onClick={() => onDelete?.(row._id, "delete")}
                          />
                      }
                  
                    </div>
                  ) : (getValue(row, col, i))}
                </td>
              ))}
            </tr>
          )) :<tr>
                <td  colSpan={rows.length + (isCheckBox ? 1 : 0)} style={{ textAlign: "center" }}>
                  No data found
                </td>
          </tr>}
        </tbody>
      </table>
    </div>
    <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modal_title} Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {selectedUser && (
              <div className="d-flex flex-column gap-2">
                {modal_header.map((col) => (
                  <div key={col}>
                    <strong>{col.charAt(0).toUpperCase() + col.slice(1)}:</strong>{" "}
                    {getValue(selectedUser, col)}
                  </div>
                ))}
              </div>
            )}
          </Modal.Body>

        <Modal.Footer>
        </Modal.Footer>
      </Modal>
    </>
  );
}
