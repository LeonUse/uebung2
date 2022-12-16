import { useParams } from "react-router";
import axios from "axios";
import React from "react";
import { Button, Stack } from "@mui/material";

export default function Vote() {
  const [poll, setPoll] = React.useState<Poll>({
    id: "",
    poll: "",
    Options: [""],
  });
  const { id } = useParams();
  function getPollData() {
    axios.get("http://localhost:9000/getPoll/" + id).then((response: any) => {
      setPoll(response.data);
    });
  }

  React.useEffect(() => {
    getPollData();
  }, []);

  return (
    <div className="center">
      <h1>{poll.poll}</h1>
      <div className="centerSmall">
        <Stack
          direction="column"
          justifyContent="center"
          marginTop="2rem"
          spacing={3}
        >
          {poll.Options.map((option) => (
            <Button variant="contained">{option}</Button>
          ))}
        </Stack>
      </div>
    </div>
  );
}
