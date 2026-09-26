import { StatusAction, StatusPage } from "@/components/StatusPage";

const NotFound = (): React.ReactElement => (
  <StatusPage
    code="404"
    title="Page Not Found"
    message="The page you're looking for doesn't exist in the CMS."
  >
    <StatusAction href="/">Go Home</StatusAction>
  </StatusPage>
);

export default NotFound;
