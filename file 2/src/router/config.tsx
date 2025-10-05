
import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import CaseBuilder from "../pages/case-builder/page";
import SOAPGenerator from "../pages/soap-generator/page";
import AssessmentCreator from "../pages/assessment-creator/page";
import EvidenceValidator from "../pages/evidence-validator/page";
import Library from "../pages/library/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/case-builder",
    element: <CaseBuilder />,
  },
  {
    path: "/soap-generator",
    element: <SOAPGenerator />,
  },
  {
    path: "/assessment-creator",
    element: <AssessmentCreator />,
  },
  {
    path: "/evidence-validator",
    element: <EvidenceValidator />,
  },
  {
    path: "/library",
    element: <Library />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
