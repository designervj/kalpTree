import Badge from "./Badge";

const GetStatusBadge = ({ status }: { status: string }) => {
  if (status === "active") {
    return <Badge variant="green">Active</Badge>;
  } else if (status === "paused") {
    return <Badge variant="amber">Paused</Badge>;
  } else {
    return <Badge>Inactive</Badge>;
  }
}

export default GetStatusBadge