import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/admin", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>Redirecting to Admin Panel...</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="w-full bg-emerald-700 hover:bg-emerald-800" onClick={() => navigate("/admin")}>
            Go to Admin Panel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}