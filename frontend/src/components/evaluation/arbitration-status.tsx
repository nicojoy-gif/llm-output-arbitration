import { CheckCircle2, Equal, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { ArbitrationStatus as Status } from "@/types/arbitration";

export function ArbitrationStatusBadge({ status }: { status: Status }) {
  return status === "success" ? (
    <Badge variant="success">
      <CheckCircle2 aria-hidden /> Success
    </Badge>
  ) : (
    <Badge variant="danger">
      <XCircle aria-hidden /> Failed
    </Badge>
  );
}

export function TieBadge() {
  return (
    <Badge variant="warning" title="Equal highest scores among eligible candidates">
      <Equal aria-hidden /> Tie
    </Badge>
  );
}
