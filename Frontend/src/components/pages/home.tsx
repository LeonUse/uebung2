import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [id, setId] = React.useState<String>("");
  const navigate = useNavigate();
  const handleChangeId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setId(event.target.value);
  };

  function joinPoll() {
    navigate("/vote/" + id);
  }

  return (
    <div className="center">
      <Link to="/newPoll" style={{ textDecoration: "none", color: "Black" }}>
        <Typography textAlign="center" fontSize="2rem" marginBottom="2rem">
          Create new Poll
        </Typography>
      </Link>
      <h1>Join Poll</h1>
      <Stack
        direction="row"
        justifyContent="center"
        marginTop="2rem"
        spacing={3}
      >
        <TextField
          id="standard-multiline-static"
          label=""
          helperText="Poll ID"
          variant="standard"
          value={id}
          onChange={handleChangeId}
        />
        <Button variant="outlined" onClick={joinPoll}>
          Go
        </Button>
      </Stack>
    </div>
  );
}
