import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";

export default function Home() {
  return (
    <>
      <Link to="/newPoll" style={{ textDecoration: "none", color: "Black" }}>
        <Typography textAlign="center" fontSize="2rem">
          Create new Poll
        </Typography>
      </Link>
    </>
  );
}
