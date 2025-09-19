import Badge from "./badge";
import Button from "./button";
import Card from "./card";
import CardBody from "./card-body";
import CardHeader from "./card-header";
import CardFooter from "./card-footer";
import Input from "./input";
import Select from "./select";
import Table from "./table";
import LoadingSpinner from "./loading-spinner";

const TOKENS = {
  primary: "#003366", // Dark Blue from Springfield logo text
  primarySoft: "#E6F0F8", // Very light blue for soft backgrounds
  redAccent: "#EC1D24", // Red from the Springfield logo pin (used for danger/warning)
  text: "#333333", // Dark grey for general text
  muted: "#6B7280", // Standard muted grey for secondary text
  border: "#D1D5DB", // Light grey for borders
  bg: "#F8FAFC", // Light off-white for the main background
  white: "#FFFFFF",
};

const CHART_COLORS = [
  TOKENS.primary,
  TOKENS.redAccent,
  "#6699CC",
  "#99CCFF",
  "#C0C0C0",
];

export {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Input,
  Select,
  Table,
  LoadingSpinner,
  CHART_COLORS,
  TOKENS,
};
