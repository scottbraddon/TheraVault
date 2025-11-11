import { Shield, Lock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function OfflineIndicator() {
  return (
    <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
      <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
      <AlertDescription className="flex items-center gap-2 text-sm">
        <span className="font-medium text-green-900 dark:text-green-100">Local Mode Active</span>
        <span className="text-green-700 dark:text-green-300">No internet required</span>
        <Lock className="h-3 w-3 ml-auto text-green-600 dark:text-green-400" />
      </AlertDescription>
    </Alert>
  );
}
