import { ReactNode } from 'react';

interface CardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  color?: string;
}

export default function Card({ title, value, icon, color = "#D4AF75" }: CardProps) {
  return (
    <div className="card">
      <div className="card-header">
        {icon && (
          <div className="card-icon" style={{ backgroundColor: color }}>
            {icon}
          </div>
        )}
        <span className="card-title">{title}</span>
      </div>
      <div className="card-value">{value}</div>
    </div>
  );
}