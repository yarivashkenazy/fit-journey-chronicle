
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

const StatsCard = ({ title, value, description, icon, footer, className }: StatsCardProps) => {
  return (
    <Card className={`overflow-hidden ${className || ""}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-fitness-primary">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardContent>
      {footer && <CardFooter className="px-4 py-2 bg-muted/30">{footer}</CardFooter>}
    </Card>
  );
};

export default StatsCard;
