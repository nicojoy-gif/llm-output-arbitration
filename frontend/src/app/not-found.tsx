import Link from "next/link";
import { Compass } from "lucide-react";

import { EmptyState } from "@/components/shared/states";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <EmptyState
      icon={Compass}
      className="mt-10"
      title="Page not found"
      description="The page you are looking for does not exist."
      action={
        <Button asChild size="sm">
          <Link href="/">Back to overview</Link>
        </Button>
      }
    />
  );
}
